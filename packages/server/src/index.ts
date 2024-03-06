import { existsSync, readFileSync, writeFile } from 'fs';
import { join } from 'path';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { config } from 'dotenv';
import { Valhalla } from '@iwpnd/valhalla-ts/dist/valhalla';

config();

const valhalla = new Valhalla(process.env.VALHALLA_SERVER);
const settingsFile = join(process.cwd(), 'settings.json');

type Settings = Record<string, any>;
let settings: Settings = {};

if (existsSync(settingsFile)) {
  const b = readFileSync(settingsFile, 'utf8');
  settings = JSON.parse(b.toString());
}

const app = new Hono();

app.use('/api/*', cors());
app.use('/*', serveStatic({ root: '/public' }));

app.get('/hello', (c) => {
  return c.text('Hello Hono!');
});
app.get('/api/settings', (c) => c.json(settings));
app.post('/api/settings', async (c) => {
  const s = await c.req.json<Settings>();
  settings = s;
  writeFile(settingsFile, JSON.stringify(settings), 'utf8' as BufferEncoding, (err) => err && console.error(err));
  return c.text('OK');
});
app.post('/api/route', async (c) => {
  const r = await c.req.json<{}>();

  const route = await valhalla.route({
    locations: [
      { lat: 51.46104, lon: 5.501747 },
      { lat: 52.141917, lon: 4.334106 },
    ],
    costing: 'auto',
  });
  console.log(route);

  console.log(r);
  return c.json({
    type: 'FeatureCollection',
    geometry: {
      type: 'Polyline',
      coordinates: [[]],
    },
    properties: {
      durations: [],
    },
  });
});

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};
