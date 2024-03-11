/**
 * Costing Models used in routing
 */
export declare enum CostingModels {
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
  costing: `${CostingModels.AUTO}`;
  locations: Position[];
}
