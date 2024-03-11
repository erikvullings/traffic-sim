import { PriorityQueue, Comparator } from './priority-queue';

export interface Position {
  lat: number;
  lon: number;
}

interface ExtVehicle {
  id: string;
  /** Sequence of positions along which the vehicle will move */
  path: Position[];
  /** Duration to traverse a path segment in msec */
  durations: number[];
  paused: boolean;
  /** Current location in the path */
  curPosIdx: number;
  /** Last update time in msec */
  lastUpdate: number;
}

export interface SimulationEvent {
  time: number;
  type: 'MOVE' | 'PAUSE' | 'RESUME';
  vehicle: ExtVehicle;
}

export type Vehicle = Omit<ExtVehicle, 'lastUpdate' | 'curPosIdx'>;

export type VehiclePos = Position & Pick<Vehicle, 'id' | 'paused'>;

export class TrafficSimulator {
  private currentTime = 0;
  private eventQueue: PriorityQueue<SimulationEvent>;
  private vehicles: ExtVehicle[] = [];

  constructor(vehicles: Vehicle[] = []) {
    const comparator: Comparator<SimulationEvent> = (a, b) => a.time - b.time;
    this.currentTime = 0;
    this.eventQueue = new PriorityQueue<SimulationEvent>(comparator);
    vehicles.forEach((v) => this.addVehicle(v));
  }

  private calculateCurPosition(vehicle: ExtVehicle): Position {
    const curPos = vehicle.path[vehicle.curPosIdx];
    const availableTime = this.currentTime - vehicle.lastUpdate;
    const nextPosIdx = vehicle.curPosIdx + 1;
    if (nextPosIdx < vehicle.path.length && availableTime > 0) {
      const nextPos = vehicle.path[nextPosIdx];
      const duration = vehicle.durations[vehicle.curPosIdx];
      const progressRatio = availableTime / duration;
      if (progressRatio > 1) {
        console.warn(`Progress ratio ${progressRatio} for vehicle ${JSON.stringify(vehicle)}.`);
        return curPos;
      }
      const latDiff = nextPos.lat - curPos.lat;
      const lonDiff = nextPos.lon - curPos.lon;
      const lat = curPos.lat + latDiff * progressRatio;
      const lon = curPos.lon + lonDiff * progressRatio;
      return { lat, lon };
    } else {
      return curPos;
    }
  }

  private updateVehiclePosition(vehicle: ExtVehicle): void {
    if (vehicle.paused) return;

    const nextPosIdx = vehicle.curPosIdx + 1;
    if (nextPosIdx < vehicle.path.length) {
      const duration = vehicle.durations[vehicle.curPosIdx];
      const event: SimulationEvent = {
        time: this.currentTime + duration,
        type: 'MOVE',
        vehicle,
      };
      vehicle.curPosIdx = nextPosIdx;
      vehicle.lastUpdate = this.currentTime;
      // Schedule the next move event for the vehicle
      this.eventQueue.enqueue(event);
    } else {
      vehicle.paused = true;
    }
  }

  private processEvent({ type, vehicle }: SimulationEvent): void {
    switch (type) {
      case 'MOVE':
        this.updateVehiclePosition(vehicle);
        break;
      case 'PAUSE':
        vehicle.paused = true;
        break;
      case 'RESUME':
        vehicle.paused = false;
        break;
      default:
        console.error(`Unknown event type: ${type}`);
    }
  }

  public init(now = Date.now()): void {
    this.currentTime = now;
    this.eventQueue.forEach((t) => (t.time = now));
  }

  public runUntil(time: number): Array<VehiclePos> {
    while (!this.eventQueue.isEmpty() && this.eventQueue.peek()!.time < time) {
      const nextEvent = this.eventQueue.dequeue()!;
      this.currentTime = nextEvent.time;
      this.processEvent(nextEvent);
    }
    console.log(`TIME: ${new Date(this.currentTime).toISOString()}\n${this.eventQueue.log()}`);
    return this.vehicles.map((v) => ({ id: v.id, paused: v.paused, ...this.calculateCurPosition(v) }));
  }

  public reset() {
    this.vehicles = [];
    this.eventQueue.clear();
  }

  public addVehicle(newVehicle: Vehicle): void {
    const vehicle: ExtVehicle = { lastUpdate: this.currentTime, curPosIdx: 0, ...newVehicle };
    const idx = this.vehicles.findIndex((v) => v.id === newVehicle.id);
    if (idx >= 0) {
      this.vehicles[idx] = vehicle;
    } else {
      this.vehicles.push(vehicle);
    }
    const event: SimulationEvent = {
      time: this.currentTime,
      type: 'MOVE',
      vehicle,
    };
    this.eventQueue.enqueue(event);
  }

  public setVehicleState(vehicleId: string, paused: boolean): void {
    const vehicle = this.vehicles.find((v) => v.id === vehicleId);
    if (vehicle && vehicle.paused !== paused) {
      const event: SimulationEvent = {
        time: this.currentTime,
        type: paused ? 'PAUSE' : 'RESUME',
        vehicle: vehicle,
      };
      this.eventQueue.enqueue(event);
    }
  }

  public removeVehicle(vehicleId: string): void {
    const index = this.vehicles.findIndex((v) => v.id === vehicleId);
    if (index !== -1) {
      // Remove any pending events for the removed vehicle
      this.eventQueue.remove((event) => event.vehicle.id === vehicleId);
      this.vehicles.splice(index, 1);
    }
  }
}

// // Example usage:
// const vehicles: Vehicle[] = [
//     {
//         id: 'vehicle1',
//         path: [{ lat: 0, lon: 0 }, { lat: 1, lon: 1 }, { lat: 2, lon: 2 }],
//         durations: [1, 2],
//         curPosIdx: 0,
//         paused: false
//     },
//     {
//         id: 'vehicle2',
//         path: [{ lat: 3, lon: 3 }, { lat: 4, lon: 4 }, { lat: 5, lon: 5 }],
//         durations: [1, 1],
//         curPosIdx: 0,
//         paused: false
//     }
// ];

// const comparator: Comparator<SimulationEvent> = (a, b) => a.time - b.time;
// const simulator = new TrafficSimulator(vehicles, comparator);
// simulator.startSimulation(100); // Run simulation until time 100

// // Example usage of additional methods
// // Add a new vehicle after starting the simulation
// const newVehicle: Vehicle = {
//     id: 'vehicle3',
//     path: [{ lat: 6, lon: 6 }, { lat: 7, lon: 7 }, { lat: 8, lon: 8 }],
//     durations: [1, 1
