import m from 'mithril';
import { GeolocateControl, Map as MaplibreMap, NavigationControl, Popup, ScaleControl } from 'maplibre-gl';
import { Feature, FeatureCollection, Point as GeoJSONPoint } from 'geojson';
import { GeoJSONSource } from 'maplibre-gl';
import { simpleHash } from '.';
import { MeiosisComponent } from '../../services/meiosis';
import { computeETA, loadImages, setLonLat, setZoomLevel } from './map-utils';
import { PointOfInterest, Vehicle, VehicleVisibility } from '../../models';
import { render } from 'mithril-ui-form';
import { t } from '../../services';

export const MapComponent: MeiosisComponent = () => {
  let map: MaplibreMap;

  return {
    view: ({
      attrs: {
        state: { curVehicleId, sims, map, settings, route },
        actions: { getRouteSim },
      },
    }) => {
      const editPoiId = `edit-${curVehicleId}`;
      if (map) {
        const { pois = [], vehicles = [] } = settings;
        const visiblePois = pois.filter(
          (p) => p.type !== 'poi' && typeof p.lon !== 'undefined' && typeof p.lat !== 'undefined'
        );
        if (visiblePois.length > 0) {
          const features = visiblePois.map(
            ({ id, type, label, desc, lon, lat, icon, defaultIcon }) =>
              ({
                id,
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [lon, lat],
                },
                properties: { id, type, label, desc, icon: defaultIcon ? type : `icon_${simpleHash(icon)}` },
              } as Feature<GeoJSONPoint, Pick<PointOfInterest, 'id' | 'type' | 'label' | 'desc' | 'icon'>>)
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
                'icon-allow-overlap': true,
                'icon-image': ['get', 'icon'],
              },
            });
            map.on('click', id, async (e) => {
              if (!e.features || e.features.length < 1) return;
              const { geometry, properties = {} } = e.features![0];
              const { desc = '', label } = properties;
              const coordinates = (geometry as GeoJSONPoint).coordinates.slice() as [number, number];
              const description = render(
                `###### ${label}
              ${desc}`,
                true
              );
              new Popup()
                .setLngLat([coordinates[0], coordinates[1] + 0.002])
                .setHTML(description)
                .addTo(map);
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
        const routeSource = map.getSource('route') as GeoJSONSource;
        if (route) {
          // console.log('ROUTE');
          if (routeSource) {
            routeSource.setData(route);
          } else {
            map.addSource('route', { type: 'geojson', data: route });
            map.addLayer(
              {
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                  'line-cap': 'round',
                  'line-join': 'round',
                },
                paint: {
                  'line-color': '#0000ff',
                  'line-width': 5,
                  'line-opacity': 0.8,
                },
              },
              map.getLayer('sims') ? 'sims' : undefined
            );
          }
        } else if (routeSource) {
          map.removeLayer('route');
          map.removeSource('route');
        }

        let curVehicleOnMap = false;
        const lookupName = vehicles.reduce((acc, cur) => {
          acc.set(cur.id, cur.visible);
          return acc;
        }, new Map<string, VehicleVisibility>());
        const features = sims
          .filter((s) => {
            const found = lookupName.get(s[0]);
            return found !== 'hidden';
          })
          .map((vehicle) => {
            const [id, _, lon, lat, eta, desc] = vehicle;
            if (id === curVehicleId) {
              curVehicleOnMap = true;

              const source = map.getSource(editPoiId);
              if (source) {
                // console.log(`Removing layer ${curVehicleId}`);
                map.removeLayer(editPoiId);
                map.removeSource(editPoiId);
              }
            }
            const curVehicle = settings.vehicles.find((v) => v.id === id);
            if (!curVehicle) return;
            const { type, label, state, icon, defaultIcon } = curVehicle;

            return {
              id,
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lon, lat],
              },
              properties: {
                id,
                type,
                label,
                desc: desc || curVehicle.desc,
                state,
                eta: new Date(eta),
                icon: defaultIcon ? type : `icon_${simpleHash(icon)}`,
              },
            } as Feature<GeoJSONPoint, Pick<Vehicle, 'id' | 'type' | 'label' | 'desc' | 'state' | 'eta' | 'icon'>>;
          });
        const fc = { type: 'FeatureCollection', features } as FeatureCollection;

        const id = 'sims';
        const pointSource = map.getSource(id) as GeoJSONSource;
        if (pointSource) {
          pointSource.setData(fc);
        } else {
          map.addSource(id, { type: 'geojson', data: fc });
          map.addLayer({
            id,
            type: 'symbol',
            source: id,
            layout: {
              'icon-allow-overlap': true,
              'icon-image': ['get', 'icon'],
            },
          });
          map.on('click', id, async (e) => {
            if (!e.features || e.features.length < 1) return;
            const { geometry, properties = {} } = e.features![0];
            const { desc = '', label, eta, id: vehicleId } = properties;
            const coordinates = (geometry as GeoJSONPoint).coordinates.slice() as [number, number];
            const arrivalIn = computeETA(eta);
            const deltaMsg = eta === 0 ? '' : `${t('ARRIVAL_IN')} ${arrivalIn}`;
            const msg = eta === 0 ? t('ARRIVED') : `${t('ETA')}: ${new Date(eta).toLocaleTimeString()} (${deltaMsg}).`;
            const description = render(
              `###### ${label}
              ${msg}
              ${desc}`,
              true
            );
            // // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
            // map.flyTo({
            //   center: coordinates,
            // });
            new Popup()
              .setLngLat([coordinates[0], coordinates[1] + 0.002])
              .setHTML(description)
              .addTo(map);
            await getRouteSim(vehicleId);
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

        if (curVehicleId && !curVehicleOnMap) {
          const curVehicle = settings.vehicles?.find((v) => v.id === curVehicleId);
          const curVehicleSource = map.getSource(editPoiId);
          if (curVehicle && !curVehicleSource) {
            const { id, poi, type, label, desc, state, visible, eta } = curVehicle;
            const startPoint = settings.pois?.find((p) => p.id === poi) || ({} as PointOfInterest);
            const { lon, lat } = startPoint;
            const json = {
              id,
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lon, lat],
              },
              properties: { id, type, label, desc, state, visible, eta },
            } as Feature<GeoJSONPoint, Pick<Vehicle, 'id' | 'type' | 'label' | 'desc' | 'state' | 'visible' | 'eta'>>;
            if (!curVehicleSource) {
              map.addSource(editPoiId, { type: 'geojson', data: json });
              map.addLayer(
                {
                  id: editPoiId,
                  type: 'symbol',
                  source: editPoiId,
                  layout: {
                    'icon-image':
                      curVehicle.defaultIcon || !curVehicle.icon
                        ? curVehicle.type
                        : `icon_${simpleHash(curVehicle.icon)}`,
                  },
                },
                map.getLayer('sims') ? 'sims' : undefined
              );
            }
          }
        }
      }

      return m('#mapboxMap');
    },
    oncreate: ({
      attrs: {
        state: {
          settings: { vehicles, mapUrl },
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
        // hash: 'loc',
      });
      loadImages(map, vehicles);
      // loadMissingImages(map);
      // updateGrid(appState, actions, map);
      // Add map listeners
      map.on('load', () => {
        // Add draw controls
        // draw = new MapboxDraw(drawConfig);
        map.addControl(new NavigationControl(), 'top-right');
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

        // console.log('ON MAP LOAD');
        // map.on('draw.create', ({ features }) => handleDrawEvent(map, features, actions));
        // map.on('draw.update', ({ features }) => handleDrawEvent(map, features, actions));

        map.on('zoomend', () => setZoomLevel(map, actions));
        map.on('moveend', () => setLonLat(map, actions));

        // actions.loadGeoJSON();

        // map.once('styledata', () => {
        //   // console.log('On styledata');
        //   // updateSourcesAndLayers(state.sources || [], actions, map);
        //   // updateSatellite(state, map);
        // });

        setMap(map);
        // setMap(map, draw);
      });
    },
  };
};
