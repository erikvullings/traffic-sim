export * from './page';
export * from './settings';
export * from './layer-style';
export * from './valhalla';

export interface ILokiObj {
  id: number;
}

export type SimState = 'started' | 'paused' | 'reset' | 'unknown';

export type Point = [lon: number, lat: number];
export type Second = number;
export type Millisecond = number;
export type Meter = number;

export type AddVehicleToSim = {
  id: string;
  path: Point[];
  durations: Millisecond[];
};
