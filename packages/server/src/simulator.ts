import { SimInfo, TrafficSimulator, Vehicle } from './discrete-event-sim';
import { Millisecond, Point } from './utils';

export type VehicleToSim = {
  id: string;
  path: Point[];
  durations: Millisecond[];
  desc?: string;
};

export type EmitMsg = {
  type: 'state';
  data?: any;
};

export type ExtSimInfo = [...SimInfo, desc?: string];

const sim = new TrafficSimulator();

const descriptions = new Map<string, string>();

// for (let i = 0; i < 100; i++) {
//   console.table(sim.runUntil(i));
// }
const send: (msg: EmitMsg) => void = process.send!;

let simHandle: Timer | undefined = undefined;

process.on('message', (message: string | { type: string; data?: Record<string, any> }) => {
  console.log('Received message: ', JSON.stringify(message));
  // console.table(sim.runUntil(time++));
  if (typeof message !== 'object') return;
  const { type = '', data } = message;
  switch (type.toLowerCase()) {
    case 'start': {
      if (simHandle) break;
      sim.init(Date.now());
      const updateSim = () => {
        const result = sim
          .runUntil(Date.now())
          .map(([id, paused, lon, lat, eta]) => [id, paused, lon, lat, eta, descriptions.get(id)] as ExtSimInfo);
        send({ type: 'state', data: result });
        simHandle = setTimeout(updateSim, 5000);
      };
      setTimeout(updateSim, 0);
      break;
    }
    case 'pause': {
      clearTimeout(simHandle);
      simHandle = undefined;
      break;
    }
    case 'reset': {
      clearTimeout(simHandle);
      simHandle = undefined;
      sim.reset();
      break;
    }
    case 'addvehicle': {
      const vehicle = data as Vehicle;
      if (vehicle.id && vehicle.durations && vehicle.path) {
        if (typeof vehicle.paused === 'undefined') vehicle.paused = false;
        vehicle.desc && descriptions.set(vehicle.id, vehicle.desc);
        sim.addVehicle(vehicle);
      } else {
        console.warn(`Message not supported: addvehicle, ${JSON.stringify(message)}`);
      }
      break;
    }
    case 'updatevehicledesc': {
      const vehicle = data as Vehicle;
      if (vehicle.id && vehicle.desc) {
        descriptions.set(vehicle.id, vehicle.desc);
      } else {
        console.warn(`Message not supported: updatevehicledesc, ${JSON.stringify(message)}`);
      }
      break;
    }
    case 'deletevehicle': {
      const { id } = data as Pick<Vehicle, 'id'>;
      sim.removeVehicle(id);
      break;
    }
    case 'updatestate':
      const { id, state } = data as { id: string; state: 'pause' | 'resume' };
      sim.setVehicleState(id, state === 'pause');
      break;
  }
});
