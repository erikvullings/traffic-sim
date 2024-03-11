import { TrafficSimulator, Vehicle } from './discrete-event-sim';
import { Millisecond, Point } from './utils';

export type AddVehicleToSim = {
  id: string;
  path: Point[];
  durations: Millisecond[];
};

export type EmitMsg = {
  type: 'state';
  data?: any;
};

const sim = new TrafficSimulator();

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
      simHandle = setInterval(() => {
        const result = sim.runUntil(Date.now());
        send({ type: 'state', data: result });
      }, 5000);
      break;
    }
    case 'pause': {
      clearInterval(simHandle);
      simHandle = undefined;
      break;
    }
    case 'reset': {
      clearInterval(simHandle);
      simHandle = undefined;
      sim.reset();
      break;
    }
    case 'addvehicle': {
      const vehicle = data as Vehicle;
      if (vehicle.id && vehicle.durations && vehicle.path) {
        if (typeof vehicle.paused === 'undefined') vehicle.paused = false;
        sim.addVehicle(vehicle);
      } else {
        console.warn(`Message not supported: addvehicle, ${JSON.stringify(message)}`);
      }
      break;
    }
    case 'deletevehicle': {
      const { id } = data as Pick<Vehicle, 'id'>;
      sim.removeVehicle(id);
      break;
    }
    case 'updatestate':
      break;
  }
});
