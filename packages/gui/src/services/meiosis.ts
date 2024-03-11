import { meiosisSetup } from 'meiosis-setup';
import { MeiosisCell, MeiosisComponent as MComponent } from 'meiosis-setup/types';
import m, { FactoryComponent } from 'mithril';
import { routingSvc } from '.';
import {
  AddVehicleToSim,
  BaseRouteRequest,
  ID,
  LayerStyle,
  Pages,
  Point,
  Position,
  Settings,
  SimState,
  Vehicle,
} from '../models';
import { User, UserRole } from './login-service';
import { scrollToTop } from '../utils';
import { FeatureCollection, LineString } from 'geojson';

// const settingsSvc = restServiceFactory<Settings>('settings');
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
  settings: Settings;
  map: maplibregl.Map;
  // draw: MapboxDraw;
  layerStyles?: LayerStyle<Record<string, any>>[];
  // sources: Array<ISource>;
  mapStyle: string;
  /** Selected vehicle */
  curVehicleId?: ID;
  simState: SimState;
  routes?: FeatureCollection<LineString, { durations: number[] }>;
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

  /** Map services */
  setMap: (map: maplibregl.Map) => void;
  clearDrawLayer: () => void;
  setZoomLevel: (zoomLevel: number) => void;
  getZoomLevel: () => number;
  setLonLat: (lonlat: [lon: number, lat: number]) => void;
  getLonLat: () => [lon: number, lat: number];

  getRoute: (vehicle: Vehicle) => Promise<void>;

  update: (p: Partial<State>) => void;
  login: () => void;
}

export type MeiosisComponent<T extends { [key: string]: any } = {}> = FactoryComponent<{
  state: State;
  actions: Actions;
  options?: T;
}>;

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

  getRoute: async (v) => {
    const {
      settings: { pois = [] },
    } = states();
    const { lat, lon, poi, pois: poiIds = [] } = v;
    const start = pois.find((p) => p.id === poi);
    const vias = pois
      .filter((p) => poiIds.includes(p.id))
      .sort((a, b) => (poiIds.indexOf(a.id) > poiIds.indexOf(b.id) ? 1 : -1))
      .map((p) => ({ lat: p.lat, lon: p.lon }));
    const curLocation: Position = { lat: lat || start?.lat || 0, lon: lon || start?.lon || 0 };
    const body: BaseRouteRequest = {
      costing: 'auto',
      locations: [curLocation, ...vias],
    };
    const response = await m.request<FeatureCollection<LineString, { id: string; durations: number[] }>>(
      getApiRoute(v.id),
      { method: 'POST', body }
    );
    console.log(response);
    if (!response || response.features.length === 0) return;
    const feature = response.features[0];
    if (v.state === 'moving') {
      const body: AddVehicleToSim = {
        id: v.id,
        path: feature.geometry.coordinates as Point[],
        durations: feature.properties.durations,
      };
      await m.request(`${API}/sim/vehicle`, { method: 'POST', body });
    }
    update({
      routes: (r) => {
        if (r) {
          r.features = [...r.features.filter((f) => f.id !== feature.id), feature];
          return r;
        }
        return response;
      },
    });
  },

  update: (p) => update(p),
  login: () => {},
});

const app = {
  initial: {
    page: Pages.HOME,
    loggedInUser: undefined,
    role: 'user',
    simState: 'unknown',
    settings: {
      version: 0,
    } as Settings,
  } as State,
  services: [
    {
      onchange: ({ simState }) => simState === 'started' || simState === 'unknown',
      run: ({ update }) => {
        const updateSimState = async () => {
          const result = await m.request<{ running: boolean; vehicles: any[] }>(`${API}/sim/state`);
          if (!result) return;
          const { running, vehicles = [] } = result;
          const newSimState: SimState = running ? 'started' : vehicles.length === 0 ? 'reset' : 'paused';
          console.log(`Sim state: ${newSimState}`);
          console.log(vehicles);
          setTimeout(updateSimState, newSimState === 'reset' ? 10000 : 5000);
          update({ simState: newSimState });
        };
        setTimeout(updateSimState, 0);
      },
    },
  ],
} as MComponent<State>;

export const cells = meiosisSetup<State>({ app });

cells.map(() => {
  // console.log('...redrawing');
  m.redraw();
});

const loadData = async () => {
  const role = (localStorage.getItem(USER_ROLE) || 'user') as UserRole;
  const settings = await m.request<Settings>(API_SETTINGS);

  cells().update({
    role,
    settings: () => settings || {},
  });
};
loadData();
