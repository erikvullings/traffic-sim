import { i18n } from '../services';

export const LANGUAGE = 'SG_LANGUAGE';
export const SAVED = 'SG_MODEL_SAVED';

export const setLanguage = async (locale = i18n.currentLocale) => {
  localStorage.setItem(LANGUAGE, locale);
  await i18n.loadAndSetLocale(locale);
};

export type ID = string;

export type VehicleType = 'car' | 'truck' | 'bicycle' | 'pedestrian';
export type PoiType = 'poi' | 'warehouse';

/** WGS84 location in longitude (x) and latitude (y) */
export type Location = { lon: number; lat: number };

export type VehicleVisibility = 'hidden' | 'visible';
export type VehicleState = 'not_initialized' | 'moving' | 'paused';

/** Vehicles that are simulated */
export type Vehicle = Location & {
  id: ID;
  label: string;
  type: VehicleType;
  /** Markdown text describing the contents */
  desc?: string;
  /** Base64 encoded image */
  icon: string;
  /** Use default icon */
  defaultIcon: boolean;
  visible: VehicleVisibility;
  state: VehicleState;
  /** Start location when location (lat, lon) is not set */
  poi?: ID;
  /** List of POIs to visit */
  pois?: ID[];
};

/** Locations that can be used as starting point or destination */
export type PointOfInterest = Location & {
  id: ID;
  label: string;
  type: PoiType;
  /** Markdown text describing the contents */
  desc?: string;
  /** Base64 encoded image */
  icon: string;
  /** Use default icon */
  defaultIcon: boolean;
};

export type Settings = {
  version: number;
  mapUrl?: string;
  appName?: string;
  vehicles: Vehicle[];
  pois: PointOfInterest[];
};
