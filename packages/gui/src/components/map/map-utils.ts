// import bbox from '@turf/bbox';
// import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { Map as MaplibreMap } from 'maplibre-gl';

// ICONS
// import marker from '../../assets/icons/mapbox-marker-icon-20px-blue.png';
import marker from '../../assets/icons/mapbox-marker-icon-20px-blue.png';
import { Actions } from '../../services';

export const drawConfig = {
  displayControlsDefault: false,
  controls: {
    polygon: true,
    point: true,
    line_string: true,
    trash: true,
  },
};

export const loadMissingImages = (map: MaplibreMap) => {
  map.on('styleimagemissing', async (e) => {
    const id = e.id; // id of the missing image
    const url = id.endsWith('/') ? marker : `${process.env.SERVER}/layer_styles/${id}`;
    try {
      const response = await map.loadImage(url);
      if (!map.hasImage(id)) map.addImage(id, response.data);
    } catch (e: any) {
      console.error(e);
    }
  });
};

export const setZoomLevel = (map: MaplibreMap, actions: Actions) => {
  const zoom = map.getZoom();
  actions.setZoomLevel(zoom);
};

export const setLonLat = (map: MaplibreMap, actions: Actions) => {
  const lonlat = map.getCenter();
  actions.setLonLat([lonlat.lng, lonlat.lat]);
};
