import m from 'mithril';
import { GeolocateControl, Map as MaplibreMap, NavigationControl, ScaleControl } from 'maplibre-gl';
// @ts-ignore
import { MeiosisComponent } from '../../services/meiosis';
import { loadMissingImages, setLonLat, setZoomLevel } from './map-utils';
// https://github.com/korywka/mapbox-controls/tree/master/packages/tooltip
// import TooltipControl from '@mapbox-controls/tooltip';

// // @ts-ignore
// MapboxDraw.constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
// // @ts-ignore
// MapboxDraw.constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
// // @ts-ignore
// MapboxDraw.constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';

export const MapComponent: MeiosisComponent = () => {
  let map: MaplibreMap;

  return {
    view: () => {
      return [m('#mapboxMap')];
    },
    oncreate: ({
      attrs: {
        state: {
          settings: { mapUrl },
        },
        actions,
      },
    }) => {
      // const { mapUrl = '' } = state.settings;
      const { getLonLat, getZoomLevel, setMap } = actions;
      const brtStyle = {
        version: 8,
        sources: {
          'brt-achtergrondkaart': {
            type: 'raster',
            tiles: ['https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png'],
            tileSize: 256,
            minzoom: 1,
            maxzoom: 19,
            attribution: 'Kaartgegevens: <a href="https://kadaster.nl">Kadaster</a>',
          },
        },
        glyphs: 'https://api.pdok.nl/lv/bgt/ogc/v1_0/resources/fonts/{fontstack}/{range}.pbf',
        layers: [
          {
            id: 'standard-raster',
            type: 'raster',
            source: 'brt-achtergrondkaart',
          },
        ],
      } as maplibregl.StyleSpecification;
      // Create map and add controls

      map = new MaplibreMap({
        container: 'mapboxMap',
        style: mapUrl || brtStyle,
        // style: VECTOR_TILE_SERVER ? VECTOR_TILE_SERVER : brtStyle,
        center: getLonLat(),
        zoom: getZoomLevel(),
        hash: 'loc',
      });
      loadMissingImages(map);
      // updateGrid(appState, actions, map);
      // Add map listeners
      map.on('load', () => {
        // Add draw controls
        // draw = new MapboxDraw(drawConfig);
        map.addControl(new NavigationControl(), 'top-left');
        // map.addControl(draw as unknown as IControl, 'top-left');
        const scale = new ScaleControl({
          maxWidth: 200,
          unit: 'metric',
        });
        map.addControl(scale);
        map.addControl(
          new GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          'bottom-right'
        );

        map.on('error', (e) => {
          console.error(e);
          map.setStyle(brtStyle);
        });
        console.log('ON MAP LOAD');
        // map.on('draw.create', ({ features }) => handleDrawEvent(map, features, actions));
        // map.on('draw.update', ({ features }) => handleDrawEvent(map, features, actions));

        map.on('zoomend', () => setZoomLevel(map, actions));
        map.on('moveend', () => setLonLat(map, actions));

        // actions.loadGeoJSON();

        map.once('styledata', () => {
          console.log('On styledata');
          // updateSourcesAndLayers(state.sources || [], actions, map);
          // updateSatellite(state, map);
        });

        setMap(map);
        // setMap(map, draw);
      });
    },
  };
};
