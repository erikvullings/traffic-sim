import { FillLayer, LineLayer, SymbolLayer } from 'mapbox-gl';
import { ILayer, LayerStyle } from '../../models';

export const defaultLayerStyle = {
  id: 'default',
  name: 'Simple style spec',
  iconPath: `${process.env.SERVER}/layer_styles/maki`,
  ui: [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
    },
  ],
  layers: [
    {
      showLayer: true,
      type: {
        id: 'areas',
        type: 'fill',
        paint: {
          'fill-color': ['coalesce', ['get', 'fill'], '#555555'],
          // 'fill-opacity': ['coalesce', ['get', 'fill-opacity'], 0.6],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            ['coalesce', ['get', 'fill-opacity'], 0.4],
          ],
        },
        filter: ['==', '$type', 'Polygon'],
      } as FillLayer,
    },
    {
      showLayer: true,
      type: {
        id: 'lines',
        type: 'line',
        paint: {
          'line-color': ['coalesce', ['get', 'stroke'], '#555555'],
          'line-width': ['coalesce', ['get', 'stroke-width'], 2],
          'line-opacity': ['coalesce', ['get', 'stroke-opacity'], 1],
        },
        // filter: ['==', '$type', 'Polygon']
      } as LineLayer,
    },
    // {
    //   layerName: 'points',
    //   showLayer: true,
    //   type: { type: 'circle' } as mapboxgl.CircleLayer,
    //   paint: {
    //     'circle-radius': 6,
    //     'circle-color': '#B42222'
    //   },
    //   filter: ['==', '$type', 'Point']
    // },
    {
      showLayer: true,
      type: {
        id: 'icons',
        type: 'symbol',
        layout: {
          // 'icon-image': ['coalesce', ["get", "marker-symbol"], "pin"],
          // 'icon-size': ['coalesce', ["get", "marker-size"], .2], // small, medium or large
          // 'icon-color': ['coalesce', ["get", "marker-color"], "#7e7e7e"],
          // 'icon-image': [
          //   'coalesce',
          //   ['get', 'marker-symbol'],
          //   // ['image', ['concat', ['get', 'icon'], '_15']],
          //   'MARKER',
          // ],
          'icon-size': ['coalesce', ['get', 'marker-size'], 2],
          'icon-image': ['concat', 'default/maki/', ['get', 'marker-symbol']],
          'text-field': ['coalesce', ['get', 'title'], ''],
          // Existing fonts are located in maptiler container, in /usr/src/app/node_modules/tileserver-gl-styles/fonts
          // By default, only 'Noto Sans Regular' exists.
          'text-font': ['Noto Sans Regular'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
        },
        paint: {
          // 'icon-color': 'red',
          // 'icon-halo-color': '#0000ff',
          'icon-color': ['case', ['boolean', ['feature-state', 'isSelected'], false], '#0000ff', '#000000'],
        },
        filter: ['==', '$type', 'Point'],
      } as SymbolLayer,
    },
    // {
    //   layerName: 'points',
    //   showLayer: true,
    //   type: { type: 'symbol' } as mapboxgl.AnyLayer,
    //   layout: {
    //     'icon-image': 'fireman',
    //     'icon-size': 0.5,
    //     'icon-allow-overlap': true,
    //   } as any,
    //   filter: ['all', ['in', 'type', 'man', 'firefighter']],
    // },
    // {
    //   id: 'population',
    //   type: 'circle',
    //   source: 'ethnicity',
    //   'source-layer': 'sf2010',
    //   paint: {
    //     // Make circles larger as the user zooms from z12 to z22.
    //     'circle-radius': {
    //       base: 1.75,
    //       stops: [
    //         [12, 2],
    //         [22, 180],
    //       ],
    //     },
    //     // Color circles by ethnicity, using a `match` expression.
    //     'circle-color': [
    //       'match',
    //       ['get', 'ethnicity'],
    //       'White',
    //       '#fbb03b',
    //       'Black',
    //       '#223b53',
    //       'Hispanic',
    //       '#e55e5e',
    //       'Asian',
    //       '#3bb2d0',
    //       /* other */ '#ccc',
    //     ],
    //   },
    // },
  ] as ILayer[],
  icons: [
    ['Aerialway', 'aerialway.png'],
    ['Airfield', 'airfield.png'],
    ['Airport', 'airport.png'],
    ['Alcohol', 'alcohol-shop.png'],
    ['American', 'american-football.png'],
    ['Amusement', 'amusement-park.png'],
    ['Animal', 'animal-shelter.png'],
    ['Aquarium', 'aquarium.png'],
    ['Arrow', 'arrow.png'],
    ['Art', 'art-gallery.png'],
    ['Attraction', 'attraction.png'],
    ['Bakery', 'bakery.png'],
    ['Bank', 'bank.png'],
    ['Bank', 'bank-JP.png'],
    ['Bar', 'bar.png'],
    ['Barrier', 'barrier.png'],
    ['Baseball', 'baseball.png'],
    ['Basketball', 'basketball.png'],
    ['Bbq', 'bbq.png'],
    ['Beach', 'beach.png'],
    ['Beer', 'beer.png'],
    ['Bicycle', 'bicycle.png'],
    ['Bicycle', 'bicycle-share.png'],
    ['Blood', 'blood-bank.png'],
    ['Bowling', 'bowling-alley.png'],
    ['Bridge', 'bridge.png'],
    ['Building', 'building.png'],
    ['Building', 'building-alt1.png'],
    ['Bus', 'bus.png'],
    ['Cafe', 'cafe.png'],
    ['Campsite', 'campsite.png'],
    ['Car', 'car.png'],
    ['Car', 'car-rental.png'],
    ['Car', 'car-repair.png'],
    ['Casino', 'casino.png'],
    ['Castle', 'castle.png'],
    ['Castle', 'castle-JP.png'],
    ['Caution', 'caution.png'],
    ['Cemetery', 'cemetery.png'],
    ['Cemetery', 'cemetery-JP.png'],
    ['Charging', 'charging-station.png'],
    ['Cinema', 'cinema.png'],
    ['Circle', 'circle.png'],
    ['Circle', 'circle-stroked.png'],
    ['City', 'city.png'],
    ['Clothing', 'clothing-store.png'],
    ['College', 'college.png'],
    ['College', 'college-JP.png'],
    ['Commercial', 'commercial.png'],
    ['Communications', 'communications-tower.png'],
    ['Confectionery', 'confectionery.png'],
    ['Construction', 'construction.png'],
    ['Convenience', 'convenience.png'],
    ['Cricket', 'cricket.png'],
    ['Cross', 'cross.png'],
    ['Dam', 'dam.png'],
    ['Danger', 'danger.png'],
    ['Defibrillator', 'defibrillator.png'],
    ['Dentist', 'dentist.png'],
    ['Diamond', 'diamond.png'],
    ['Doctor', 'doctor.png'],
    ['Dog', 'dog-park.png'],
    ['Drinking', 'drinking-water.png'],
    ['Elevator', 'elevator.png'],
    ['Embassy', 'embassy.png'],
    ['Emergency', 'emergency-phone.png'],
    ['Entrance', 'entrance.png'],
    ['Entrance', 'entrance-alt1.png'],
    ['Farm', 'farm.png'],
    ['Fast', 'fast-food.png'],
    ['Fence', 'fence.png'],
    ['Ferry', 'ferry.png'],
    ['Ferry', 'ferry-JP.png'],
    ['Fire', 'fire-station.png'],
    ['Fire', 'fire-station-JP.png'],
    ['Fitness', 'fitness-centre.png'],
    ['Florist', 'florist.png'],
    ['Fuel', 'fuel.png'],
    ['Furniture', 'furniture.png'],
    ['Gaming', 'gaming.png'],
    ['Garden', 'garden.png'],
    ['Garden', 'garden-centre.png'],
    ['Gate', 'gate.png'],
    ['Gift', 'gift.png'],
    ['Globe', 'globe.png'],
    ['Golf', 'golf.png'],
    ['Grocery', 'grocery.png'],
    ['Hairdresser', 'hairdresser.png'],
    ['Harbor', 'harbor.png'],
    ['Hardware', 'hardware.png'],
    ['Heart', 'heart.png'],
    ['Heliport', 'heliport.png'],
    ['Highway', 'highway-rest-area.png'],
    ['Historic', 'historic.png'],
    ['Home', 'home.png'],
    ['Horse', 'horse-riding.png'],
    ['Hospital', 'hospital.png'],
    ['Hospital', 'hospital-JP.png'],
    ['Hot', 'hot-spring.png'],
    ['Ice', 'ice-cream.png'],
    ['Industry', 'industry.png'],
    ['Information', 'information.png'],
    ['Jewelry', 'jewelry-store.png'],
    ['Karaoke', 'karaoke.png'],
    ['Landmark', 'landmark.png'],
    ['Landmark', 'landmark-JP.png'],
    ['Landuse', 'landuse.png'],
    ['Laundry', 'laundry.png'],
    ['Library', 'library.png'],
    ['Lift', 'lift-gate.png'],
    ['Lighthouse', 'lighthouse.png'],
    ['Lighthouse', 'lighthouse-JP.png'],
    ['Lodging', 'lodging.png'],
    ['Logging', 'logging.png'],
    ['Marker', 'marker.png'],
    ['Marker', 'marker-stroked.png'],
    ['Mobile', 'mobile-phone.png'],
    ['Monument', 'monument.png'],
    ['Monument', 'monument-JP.png'],
    ['Mountain', 'mountain.png'],
    ['Museum', 'museum.png'],
    ['Music', 'music.png'],
    ['Natural', 'natural.png'],
    ['Observation', 'observation-tower.png'],
    ['Optician', 'optician.png'],
    ['Paint', 'paint.png'],
    ['Park', 'park.png'],
    ['Park', 'park-alt1.png'],
    ['Parking', 'parking.png'],
    ['Parking', 'parking-garage.png'],
    ['Parking', 'parking-paid.png'],
    ['Pharmacy', 'pharmacy.png'],
    ['Picnic', 'picnic-site.png'],
    ['Pitch', 'pitch.png'],
    ['Place', 'place-of-worship.png'],
    ['Playground', 'playground.png'],
    ['Police', 'police.png'],
    ['Police', 'police-JP.png'],
    ['Post', 'post.png'],
    ['Post', 'post-JP.png'],
    ['Prison', 'prison.png'],
    ['Racetrack', 'racetrack.png'],
    ['Racetrack', 'racetrack-boat.png'],
    ['Racetrack', 'racetrack-cycling.png'],
    ['Racetrack', 'racetrack-horse.png'],
    ['Rail', 'rail.png'],
    ['Rail', 'rail-light.png'],
    ['Rail', 'rail-metro.png'],
    ['Ranger', 'ranger-station.png'],
    ['Recycling', 'recycling.png'],
    ['Religious', 'religious-buddhist.png'],
    ['Religious', 'religious-christian.png'],
    ['Religious', 'religious-jewish.png'],
    ['Religious', 'religious-muslim.png'],
    ['Religious', 'religious-shinto.png'],
    ['Residential', 'residential-community.png'],
    ['Restaurant', 'restaurant.png'],
    ['Restaurant', 'restaurant-bbq.png'],
    ['Restaurant', 'restaurant-noodle.png'],
    ['Restaurant', 'restaurant-pizza.png'],
    ['Restaurant', 'restaurant-seafood.png'],
    ['Restaurant', 'restaurant-sushi.png'],
    ['Road', 'road-accident.png'],
    ['Roadblock', 'roadblock.png'],
    ['Rocket', 'rocket.png'],
    ['School', 'school.png'],
    ['School', 'school-JP.png'],
    ['Scooter', 'scooter.png'],
    ['Shelter', 'shelter.png'],
    ['Shoe', 'shoe.png'],
    ['Shop', 'shop.png'],
    ['Skateboard', 'skateboard.png'],
    ['Skiing', 'skiing.png'],
    ['Slaughterhouse', 'slaughterhouse.png'],
    ['Slipway', 'slipway.png'],
    ['Snowmobile', 'snowmobile.png'],
    ['Soccer', 'soccer.png'],
    ['Square', 'square.png'],
    ['Square', 'square-stroked.png'],
    ['Stadium', 'stadium.png'],
    ['Star', 'star.png'],
    ['Star', 'star-stroked.png'],
    ['Suitcase', 'suitcase.png'],
    ['Swimming', 'swimming.png'],
    ['Table', 'table-tennis.png'],
    ['Teahouse', 'teahouse.png'],
    ['Telephone', 'telephone.png'],
    ['Tennis', 'tennis.png'],
    ['Terminal', 'terminal.png'],
    ['Theatre', 'theatre.png'],
    ['Toilet', 'toilet.png'],
    ['Toll', 'toll.png'],
    ['Town', 'town.png'],
    ['Town', 'town-hall.png'],
    ['Triangle', 'triangle.png'],
    ['Triangle', 'triangle-stroked.png'],
    ['Tunnel', 'tunnel.png'],
    ['Veterinary', 'veterinary.png'],
    ['Viewpoint', 'viewpoint.png'],
    ['Village', 'village.png'],
    ['Volcano', 'volcano.png'],
    ['Volleyball', 'volleyball.png'],
    ['Warehouse', 'warehouse.png'],
    ['Waste', 'waste-basket.png'],
    ['Watch', 'watch.png'],
    ['Water', 'water.png'],
    ['Waterfall', 'waterfall.png'],
    ['Watermill', 'watermill.png'],
    ['Wetland', 'wetland.png'],
    ['Wheelchair', 'wheelchair.png'],
    ['Windmill', 'windmill.png'],
    ['Zoo', 'zoo.png'],
  ] as Array<[name: string, src: string]>,
} as LayerStyle<any>;
