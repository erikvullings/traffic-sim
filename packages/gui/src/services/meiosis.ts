import { meiosisSetup } from 'meiosis-setup';
import { MeiosisCell, MeiosisComponent as MComponent, Patch, Service } from 'meiosis-setup/types';
import m, { FactoryComponent } from 'mithril';
import { Languages, i18n, routingSvc } from '.';
import {
  AddVehicleToSim,
  BaseRouteRequest,
  ID,
  LayerStyle,
  Pages,
  Point,
  Position,
  RouteGeoJSON,
  Settings,
  SimState,
  Vehicle,
  ExtSimInfo,
  VehicleState,
} from '../models';
import { User, UserRole } from './login-service';
import { scrollToTop } from '../utils';
import { vehicleTypeToCosting } from '../components/map';

// const settingsSvc = restServiceFactory<Settings>('settings');
export const LANGUAGE = 'TS_LANGUAGE';
const USER_ROLE = 'TS_USER_ROLE';
const ZOOM_LEVEL = 'TS_ZOOM_LEVEL';
const LON_LAT = 'TS_LON_LAT';

export const APP_TITLE = 'Traffic Simulator';
export const API = `${process.env.SERVER}/api`;
const API_SETTINGS = `${API}/settings`;
const getApiRoute = (id: string) => `${API}/route/${id}`;

export interface State {
  page: Pages;
  loggedInUser?: User;
  role: UserRole;
  language: Languages;
  settings: Settings;
  map: maplibregl.Map;
  // draw: MapboxDraw;
  layerStyles?: LayerStyle<Record<string, any>>[];
  // sources: Array<ISource>;
  mapStyle: string;
  /** Selected vehicle */
  curVehicleId?: ID;
  simState: SimState;
  sims: ExtSimInfo[];
  /** Current route that was just obtained from Valhalla */
  route?: RouteGeoJSON;
  /** All routes of the sims */
  routes?: RouteGeoJSON;
}

export interface Actions {
  setPage: (page: Pages, info?: string) => void;
  changePage: (
    page: Pages,
    params?: Record<string, string | number | undefined>,
    query?: Record<string, string | number | undefined>
  ) => void;
  saveSettings: (settings: Settings) => Promise<void>;
  setRole: (role: UserRole) => void;
  setLanguage: (language: Languages) => void;

  /** Map services */
  setMap: (map: maplibregl.Map) => void;
  clearDrawLayer: () => void;
  setZoomLevel: (zoomLevel: number) => void;
  getZoomLevel: () => number;
  setLonLat: (lonlat: [lon: number, lat: number]) => void;
  getLonLat: () => [lon: number, lat: number];

  getRoute: (vehicle: Vehicle) => Promise<void>;
  getRouteSim: (vehicleId: ID) => Promise<void>;
  pauseResumeVehicle: (vehicle: Vehicle) => Promise<void>;
  updateSimDesc: (id: string, desc: string) => Promise<void>;

  update: (patch: Patch<State>) => any;
  login: () => void;
}

export type MeiosisComponent<T extends { [key: string]: any } = {}> = FactoryComponent<{
  state: State;
  actions: Actions;
  options?: T;
}>;

export const setLanguage = async (locale = i18n.currentLocale) => {
  localStorage.setItem(LANGUAGE, locale);
  await i18n.loadAndSetLocale(locale);
};

export const appActions: (cell: MeiosisCell<State>) => Actions = ({ update, states }) => ({
  // addDucks: (cell, amount) => {
  //   cell.update({ ducks: (value) => value + amount });
  // },
  setPage: (page, info) => {
    const { settings: { appName = APP_TITLE } = {} } = states();
    document.title = `${appName} | ${page.replace('_', ' ')}${info ? ` | ${info}` : ''}`;
    // const curPage = states().page;
    // if (curPage === page) return;
    update({
      page: () => {
        scrollToTop();
        return page;
      },
    });
  },
  changePage: (page, params, query) => {
    const { settings: { appName = APP_TITLE } = {} } = states();
    routingSvc && routingSvc.switchTo(page, params, query);
    document.title = `${appName} | ${page.replace('_', ' ')}`;
    update({ page });
  },
  saveSettings: async (settings: Settings) => {
    if (typeof settings.version === 'undefined') settings.version = 0;
    settings.version++;
    // await settingsSvc.save(settings);
    await m.request(API_SETTINGS, {
      method: 'POST',
      body: settings,
    });
    update({
      settings: () => settings,
    });
  },
  setRole: (role) => {
    localStorage.setItem(USER_ROLE, role);
    update({ role });
  },
  setLanguage: (language: Languages) => {
    setLanguage(language);
    update({ language });
  },

  setMap: (map) => update({ map: () => map }),
  clearDrawLayer: () => {
    // const { draw } = states();
    // if (draw) draw.deleteAll();
  },
  setZoomLevel: (zoomLevel: number) => {
    localStorage.setItem(ZOOM_LEVEL, zoomLevel.toString());
  },
  getZoomLevel: () => +(localStorage.getItem(ZOOM_LEVEL) || 4),
  setLonLat: (lonlat: [lon: number, lat: number]) => {
    localStorage.setItem(LON_LAT, JSON.stringify(lonlat));
  },
  getLonLat: () => JSON.parse(localStorage.getItem(LON_LAT) || '[5, 51]') as [lon: number, lat: number],

  getRoute: async (vehicle) => {
    const { sims, settings } = states();
    settings.vehicles = settings.vehicles.map((v) => (v.id === vehicle.id ? vehicle : v));
    if (vehicle.visible === 'hidden') {
      update({ settings });
      return;
    }
    const { pois = [] } = settings;
    const { id, poi, pois: poiIds = [] } = vehicle;
    const sim = sims.find((s) => s[0] === id);
    const lon = sim ? sim[2] : undefined;
    const lat = sim ? sim[3] : undefined;
    const start = pois.find((p) => p.id === poi);
    const vias = pois
      .filter((p) => poiIds.includes(p.id))
      .sort((a, b) => (poiIds.indexOf(a.id) > poiIds.indexOf(b.id) ? 1 : -1))
      .map((p) => ({ lat: p.lat, lon: p.lon }));
    const curLocation: Position = { lat: lat || start?.lat || 0, lon: lon || start?.lon || 0 };
    const body: BaseRouteRequest = {
      costing: `${vehicleTypeToCosting(vehicle.type)}`,
      locations: [curLocation, ...vias],
    };
    if (body.locations.length < 2) return;
    // console.log(body);
    const route = await m.request<RouteGeoJSON>(getApiRoute(vehicle.id), { method: 'POST', body });
    // console.log(route);
    if (!route || route.features.length === 0) return;
    const feature = route.features[0];
    if (vehicle.state === 'moving') {
      const body: AddVehicleToSim = {
        id: vehicle.id,
        path: feature.geometry.coordinates as Point[],
        durations: feature.properties.durations,
      };
      await m.request(`${API}/sim/vehicle`, { method: 'POST', body });
    }
    update({
      route: () => route,
      routes: (r) => {
        if (r) {
          r.features = [...r.features.filter((f) => f.id !== feature.id), feature];
          return r;
        }
        return route;
      },
    });
  },
  getRouteSim: async (vehicleId) => {
    const route = await m.request<RouteGeoJSON>(`${API}/sim/vehicle/${vehicleId}`);
    update({
      route: () => route,
    });
  },
  pauseResumeVehicle: async (vehicle: Vehicle) => {
    const { route } = states();
    const { id, state } = vehicle;
    const newState: VehicleState = state === 'moving' ? 'paused' : 'moving';
    if (newState === 'moving') {
      if (route) {
        const feature = route.features[0];
        const body: AddVehicleToSim = {
          id,
          path: feature.geometry.coordinates as Point[],
          durations: feature.properties.durations,
        };
        await m.request(`${API}/sim/vehicle`, { method: 'POST', body });
      } else {
        await m.request<boolean>(`${API}/sim/vehicle/resume/${id}`, {
          method: 'PATCH',
        });
      }
    } else {
      await m.request<boolean>(`${API}/sim/vehicle/pause/${id}`, {
        method: 'PATCH',
      });
    }
    update({
      route: undefined,
      settings: (s) => {
        const vehicle = s.vehicles?.find((v) => v.id === id);
        if (vehicle) vehicle.state = newState;
        return s;
      },
    });
  },
  updateSimDesc: async (id, desc) => {
    await m.request<boolean>(`${API}/sim/vehicle/desc/${id}`, {
      method: 'PATCH',
      body: { id, desc },
    });
  },

  update: (p) => update(p),
  login: () => {},
});

let updateSimServiceStarted = false;

/** Service to update the simulation state */
const updateSimState: Service<State> = {
  run: ({ update, getState }) => {
    if (updateSimServiceStarted) return;
    updateSimServiceStarted = true;
    const updateSimState = async () => {
      const { page, simState } = getState();
      if (page === Pages.SETTINGS) {
        setTimeout(updateSimState, simState === 'started' ? 5000 : 10000);
        return;
      }
      const result = await m.request<{ running: boolean; vehicles: ExtSimInfo[] }>(`${API}/sim/state`);
      if (!result) return;
      const { running, vehicles = [] } = result;
      const newSimState: SimState = running ? 'started' : vehicles.length === 0 ? 'reset' : 'paused';
      if (newSimState !== 'started') {
        update({
          simState: newSimState,
        });
      } else {
        // console.log(`Sim state: ${newSimState}`);
        // console.log(vehicles);
        update({
          simState: newSimState,
          sims: () => vehicles,
          settings: (s) => {
            s.vehicles?.forEach((v) => {
              const vehicle = vehicles.find((vehicle) => vehicle[0] === v.id);
              if (vehicle) v.state = vehicle[1] ? 'paused' : 'moving';
            });
            return s;
          },
        });
      }
      setTimeout(updateSimState, newSimState === 'started' ? 5000 : 10000);
    };
    updateSimState();
  },
};

const app = {
  initial: {
    page: Pages.HOME,
    loggedInUser: undefined,
    role: 'user',
    simState: 'unknown',
    settings: {
      version: 0,
    } as Settings,
    sims: [] as ExtSimInfo[],
  } as State,
  services: [updateSimState],
} as MComponent<State>;

export const cells = meiosisSetup<State>({ app });

cells.map(() => {
  // console.log('...redrawing');
  m.redraw();
});

export const reloadSettings = async () => {
  const settings = (await m.request<Settings>(API_SETTINGS)) || {};
  if (!settings.mapUrl) {
    settings.mapUrl = 'http://localhost/maptiler/styles/basic-preview/style.json';
  }
  settings?.vehicles?.forEach((v) => {
    v.state = 'not_initialized';
    v.pois = [];
  });
  return settings;
};

const loadData = async () => {
  const role = (localStorage.getItem(USER_ROLE) || 'user') as UserRole;
  const language: Languages = (localStorage.getItem(LANGUAGE) as Languages) || 'unknown';
  const settings = await reloadSettings();

  cells().update({
    role,
    language,
    settings: () => settings || {},
  });
};
loadData();
