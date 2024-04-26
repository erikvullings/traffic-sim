// import bbox from '@turf/bbox';
// import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Map as MaplibreMap } from 'maplibre-gl';
import car from '../../assets/icons/car.png';
import truck from '../../assets/icons/truck.png';
import pedestrian from '../../assets/icons/walk.png';
import motorcycle from '../../assets/icons/motorcycle.png';
import scooter from '../../assets/icons/scooter.png';
import bicycle from '../../assets/icons/bicycle.png';
import warehouse from '../../assets/icons/warehouse.png';

// ICONS
// import marker from '../../assets/icons/mapbox-marker-icon-20px-blue.png';
// import marker from '../../assets/icons/mapbox-marker-icon-20px-blue.png';
import { Actions } from '../../services';
import { CostingModels, Vehicle, VehicleType } from '../../models';
import { padLeft } from 'mithril-materialized';

export const drawConfig = {
  displayControlsDefault: false,
  controls: {
    polygon: true,
    point: true,
    line_string: true,
    trash: true,
  },
};

export const loadImage = async (map: MaplibreMap, id: string, url: string) => {
  const img = await map.loadImage(url);
  if (!map.hasImage(id)) map.addImage(id, img.data);
};

export const loadImages = async (map: MaplibreMap, vehicles?: Vehicle[]) => {
  await loadImage(map, 'car', car);
  await loadImage(map, 'truck', truck);
  await loadImage(map, 'pedestrian', pedestrian);
  await loadImage(map, 'bicycle', bicycle);
  await loadImage(map, 'motorscooter', scooter);
  await loadImage(map, 'motorcycle', motorcycle);
  await loadImage(map, 'warehouse', warehouse);
  if (!vehicles || vehicles.length === 0) return;
  for (const vehicle of vehicles) {
    const { icon } = vehicle;
    if (!icon) continue;
    const iconId = `icon_${simpleHash(vehicle.icon)}`;
    await loadImage(map, iconId, icon);
  }
};

// export const loadMissingImages = (map: MaplibreMap) => {
//   map.on('styleimagemissing', async (e) => {
//     switch (e.id as VehicleType) {
//       case 'car': {
//         const img = await map.loadImage(car);
//         if (!map.hasImage(e.id)) map.addImage(e.id, img.data);
//         break;
//       }
//       case 'truck': {
//         const img = await map.loadImage(truck);
//         if (!map.hasImage(e.id)) map.addImage(e.id, img.data);
//         break;
//       }
//       case 'pedestrian': {
//         const img = await map.loadImage(pedestrian);
//         if (!map.hasImage(e.id)) map.addImage(e.id, img.data);
//         break;
//       }
//     }
//     const id = e.id; // id of the missing image
//     const url = id.endsWith('/') ? marker : `${process.env.SERVER}/layer_styles/${id}`;
//     try {
//       const response = await map.loadImage(url);
//       if (!map.hasImage(id)) map.addImage(id, response.data);
//     } catch (e: any) {
//       console.error(e);
//     }
//   });
// };

export const setZoomLevel = (map: MaplibreMap, actions: Actions) => {
  const zoom = map.getZoom();
  actions.setZoomLevel(zoom);
};

export const setLonLat = (map: MaplibreMap, actions: Actions) => {
  const lonlat = map.getCenter();
  actions.setLonLat([lonlat.lng, lonlat.lat]);
};

export const simpleHash = (input: string): string => {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  // Convert hash to a string of length 8
  const hashString = (hash >>> 0).toString(16).padStart(8, '0');
  return hashString.slice(0, 8);
};

export const vehicleTypeToCosting = (type: VehicleType) => {
  switch (type) {
    case 'pedestrian':
      return CostingModels.PEDESTRIAN;
    case 'bicycle':
      return CostingModels.BICYCLE;
    case 'truck':
      return CostingModels.TRUCK;
    case 'motorscooter':
      return CostingModels.MOTORSCOOTER;
    case 'motorcycle':
      return CostingModels.MOTORCYCLE;
    default:
      return CostingModels.AUTO;
  }
};

export const computeETA = (arrivalTime: number): string => {
  const now = new Date();
  const adjustedArrivalTime = new Date(arrivalTime);
  const diff = Math.abs(adjustedArrivalTime.getTime() - now.getTime());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${padLeft(hours)}:${padLeft(minutes)}`;
};
