/**
 * Costing Models used in routing
 */
export enum CostingModels {
  PEDESTRIAN = 'pedestrian',
  BICYCLE = 'bicycle',
  AUTO = 'auto',
  BUS = 'bus',
  TRUCK = 'truck',
  TAXI = 'taxi',
  MOTORSCOOTER = 'motor_scooter',
  MOTORCYCLE = 'motorcycle',
  BIKESHARE = 'bikeshare',
  MULTIMODAL = 'multimodal',
}

export type CostingModelsType = `${CostingModels}`;
export interface Position {
  /**
   * Latitude, duh
   */
  lat: number;
  /**
   * Longitude, duh
   */
  lon: number;
}

export interface BaseRouteRequest {
  costing: CostingModelsType;
  locations: Position[];
}
