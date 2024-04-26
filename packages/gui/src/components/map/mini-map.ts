import m from 'mithril';
import { MapMouseEvent, Map as MaplibreMap, NavigationControl, Popup, ScaleControl } from 'maplibre-gl';
import { Feature, FeatureCollection, Point as GeoJSONPoint } from 'geojson';
import { GeoJSONSource } from 'maplibre-gl';
import { simpleHash } from '.';
import { MeiosisComponent } from '../../services/meiosis';
import { loadImages } from './map-utils';
import { PointOfInterest, Settings } from '../../models';
import { render } from 'mithril-ui-form';
import { copyToClipboard } from '../../utils';
import { t } from '../../services';

export const MiniMapComponent: MeiosisComponent = () => {
  let map: MaplibreMap;

  const drawMap = (settings: Settings) => {
    const { pois } = settings;
    if (!pois || pois.length === 0) return;
    const visiblePois = pois.filter(
      (p) => p.type !== 'poi' && typeof p.lon !== 'undefined' && typeof p.lat !== 'undefined'
    );
    if (visiblePois.length > 0) {
      const features = visiblePois.map(
        ({ id, label, desc, type, lon, lat, icon, defaultIcon }) =>
          ({
            id,
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: { id, type, label, desc, icon: defaultIcon ? type : `icon_${simpleHash(icon)}` },
          } as Feature<GeoJSONPoint, Pick<PointOfInterest, 'id' | 'label' | 'type' | 'icon' | 'desc'>>)
      );

      const id = 'pois';
      const poiSource = map.getSource(id) as GeoJSONSource;
      const fc = { type: 'FeatureCollection', features } as FeatureCollection;
      if (poiSource) {
        poiSource.setData(fc);
      } else {
        map.addSource(id, { type: 'geojson', data: fc });
        map.addLayer({
          id,
          type: 'symbol',
          source: id,
          layout: {
            'icon-image': ['get', 'icon'],
          },
        });
        map.on('mouseover', id, (e) => {
          if (!e.features || e.features.length < 1) return;
          const { geometry, properties = {} } = e.features![0];
          const { desc = '', label } = properties;
          const coordinates = (geometry as GeoJSONPoint).coordinates.slice() as [number, number];
          const description = render(
            `###### ${label}
          ${desc}`,
            true
          );
          new Popup().setLngLat([coordinates[0], coordinates[1]]).setHTML(description).addTo(map);
        });
        // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
        map.on('mouseenter', id, () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', id, () => {
          map.getCanvas().style.cursor = '';
        });
      }
    }
  };

  return {
    view: ({
      attrs: {
        state: { settings },
      },
    }) => {
      if (map) drawMap(settings);

      return m('#mini-map');
    },
    oncreate: ({
      attrs: {
        state: { settings },
        actions,
      },
    }) => {
      const { vehicles, mapUrl } = settings;
      const { getLonLat, getZoomLevel } = actions;

      const miniMap = new MaplibreMap({
        container: 'mini-map',
        style: mapUrl!,
        // style: VECTOR_TILE_SERVER ? VECTOR_TILE_SERVER : brtStyle,
        center: getLonLat(),
        zoom: getZoomLevel(),
      });
      loadImages(miniMap, vehicles);
      miniMap.on('load', () => {
        map = miniMap;
        map.on('click', (e: MapMouseEvent) => {
          const coordinates = e.lngLat;
          const { lat, lng } = coordinates;
          const coords = `${lat}, ${lng}`;
          copyToClipboard(coords, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            const msg = `${t('COPIED')}:<br/>${coords}`;
            new Popup({ maxWidth: '500px' }).setLngLat(coordinates).setHTML(msg).addTo(map);
          });
        });
        miniMap.addControl(new NavigationControl(), 'top-right');
        const scale = new ScaleControl({
          maxWidth: 100,
          unit: 'metric',
        });
        miniMap.addControl(scale);
        m.redraw();
      });
    },
  };
};
