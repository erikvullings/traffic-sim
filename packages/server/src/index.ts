import { existsSync, readFileSync, writeFile, writeFileSync } from 'fs';
import { join } from 'path';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { config } from 'dotenv';
import { Valhalla } from '@iwpnd/valhalla-ts/dist/valhalla';
import { BaseRouteRequest, TurnByTurnRouteRequest } from '@iwpnd/valhalla-ts/dist/types/request';
import { CostingModels, LegWithManeuvers } from '@iwpnd/valhalla-ts/dist/types';
import { spawn } from 'bun';
import { convertAndTimeTrip, padLeft } from './utils';
import { EmitMsg, ExtSimInfo, VehicleToSim } from './simulator';

config();

const valhalla = new Valhalla(process.env.VALHALLA_SERVER);
const settingsFile = join(process.cwd(), 'settings.json');

type CostingModelsType = `${CostingModels}`;
type Settings = Record<string, any>;

// State
let settings: Settings = {};
let routes = new Map<string, VehicleToSim>();

const simState = {
  running: false,
  time: new Date(),
  speed: 1,
  vehicles: [],
} as {
  running: boolean;
  time: Date;
  speed: number;
  vehicles: ExtSimInfo[];
};

if (existsSync(settingsFile)) {
  const b = readFileSync(settingsFile, 'utf8');
  settings = JSON.parse(b.toString());
}

const simulator = spawn(['bun', './src/simulator.ts'], {
  stdout: 'inherit',
  ipc(message: EmitMsg) {
    // console.log('Message from simulator:', message);
    // childProc.send('Message from parent to simulator');
    const { type = 'unknown', data } = message;
    switch (type) {
      case 'state':
        const vehicles = data as ExtSimInfo[];
        console.log(
          'State updated:\n' +
            vehicles
              .map(
                ([id, paused, lon, lat, eta]) =>
                  `${padLeft(id, 12)}: ${paused ? 'paused' : 'moving'} @ (${lon.toFixed(8)}, ${lat.toFixed(8)}), ETA: ${
                    eta > 0 ? new Date(eta).toLocaleTimeString('nl-NL') : '-'
                  }`
              )
              .join('\n')
        );
        simState.vehicles = vehicles;
        break;
      case 'unknown':
        console.warn('Unknown message received: ' + JSON.stringify(message));
        break;
    }
  },
});

const app = new Hono();

app.use('/api/*', cors());
app.use('/*', serveStatic({ root: '/public' }));

// app.get('/hello/:id', (c) => {
//   simulator.send('Start simulation: ' + c.req.param('id'));
//   return c.text('Hello Hono!');
// });
app.get('/api/settings', (c) => c.json(settings));
app.post('/api/settings', async (c) => {
  const s = await c.req.json<Settings>();
  settings = s;
  writeFile(settingsFile, JSON.stringify(settings), 'utf8' as BufferEncoding, (err) => err && console.error(err));
  return c.text('OK');
});
app.post('/api/route/:id', async (c) => {
  const id = c.req.param('id');
  const r = await c.req.json<BaseRouteRequest & { costing: CostingModelsType }>();
  // console.log(r);
  const trip = await valhalla.route<LegWithManeuvers>(r as TurnByTurnRouteRequest);
  if (!trip) return c.json(undefined);
  writeFileSync(join(process.cwd(), 'route.json'), JSON.stringify(trip, null, 2));
  const result = convertAndTimeTrip(trip);
  const { length, time } = trip.summary;
  // console.log(result);

  return result && result.durations.length > 0
    ? c.json({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            id,
            geometry: {
              type: 'LineString',
              coordinates: result.coordinates,
            },
            properties: {
              length,
              time,
              durations: result.durations,
            },
          },
        ],
      })
    : c.json(undefined);
});

// API for talking to the simulator

// Controls
app.get('/api/sim/state', (c) => {
  return c.json(simState);
});
app.get('/api/sim/state/start', async (c) => {
  simulator.send({ type: 'Start', data: undefined });
  simState.running = true;
  return c.json(simState);
});
app.get('/api/sim/state/pause', async (c) => {
  simulator.send({ type: 'Pause', data: undefined });
  simState.running = false;
  return c.json(simState);
});
app.get('/api/sim/state/reset', (c) => {
  simulator.send({ type: 'Reset', data: undefined });
  simState.running = false;
  simState.vehicles = [];
  return c.json(simState);
});

// Vehicle interaction
app.post('/api/sim/vehicle', async (c) => {
  const data = await c.req.json<VehicleToSim>();
  routes.set(data.id, data);
  simulator.send({ type: 'AddVehicle', data });
  return c.json(undefined);
});
app.get('/api/sim/vehicle/:id', async (c) => {
  const id = c.req.param('id');
  const route = routes.get(id);
  return c.json(
    route
      ? {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              id,
              geometry: {
                type: 'LineString',
                coordinates: route.path,
              },
              properties: {},
            },
          ],
        }
      : undefined
  );
});
app.patch('/api/sim/vehicle/desc/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.req.json<{ id: string; desc: string }>();
  if (id === data.id) simulator.send({ type: 'UpdateVehicleDesc', data });
  return c.json(id === data.id);
});
app.patch('/api/sim/vehicle/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.req.json<VehicleToSim>();
  if (id === data.id) simulator.send({ type: 'UpdateVehicle', data });
  return c.json(id === data.id);
});
app.delete('/api/sim/vehicle/:id', (c) => {
  const id = c.req.param('id');
  simulator.send({ type: 'DeleteVehicle', data: { id } });
  return c.json(undefined);
});
app.patch('/api/sim/vehicle/pause/:id', (c) => {
  const id = c.req.param('id');
  console.log(`Pausing ${id}`);
  simulator.send({ type: 'UpdateState', data: { id, state: 'pause' } });
  return c.text('UPDATED');
});
app.patch('/api/sim/vehicle/resume/:id', (c) => {
  const id = c.req.param('id');
  console.log(`Resuming ${id}`);
  simulator.send({ type: 'UpdateState', data: { id, state: 'resume' } });
  return c.text('UPDATED');
});

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};
