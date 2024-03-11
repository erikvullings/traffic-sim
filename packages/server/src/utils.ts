import { Trip, LegWithManeuvers } from '@iwpnd/valhalla-ts/dist/types';

export type Point = [lon: number, lat: number];
export type Second = number;
export type Millisecond = number;
export type Meter = number;

/**
 * Decode encoded polyline
 * @see https://github.com/valhalla/valhalla/blob/master/docs/docs/decoding.md
 */
export const decodePolyline = (str: string, precision = 6) => {
  let index = 0;
  let lat = 0;
  let lng = 0;

  let coordinates = [] as Array<Point>;
  let shift = 0;
  let result = 0;
  let byte: null | number = null;
  let latitude_change: number;
  let longitude_change: number;
  let factor = Math.pow(10, precision);

  // Coordinates have variable length when encoded, so just keep
  // track of whether we've hit the end of the string. In each
  // loop iteration, a single coordinate is decoded.
  while (index < str.length) {
    // Reset shift, result, and byte
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

    shift = result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

    lat += latitude_change;
    lng += longitude_change;

    coordinates.push([lng / factor, lat / factor]);
  }

  return coordinates;
};

/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth in meter.
 */
export const earthRadius: number = 6371008.8;
export const earthDiameter: number = 2 * earthRadius;

const deg2rad = Math.PI / 180;

/**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
export const degreesToRadians = (degrees: number): number => (degrees % 360) * deg2rad;

/**
 * Calculates the distance between two points in meters.
 * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
 * @param from from origin point
 * @param to to destination point
 * @returns distance in meters
 * @see https://github.com/Turfjs/turf/blob/master/packages/turf-distance/index.ts
 */
export const distance = (from: Point, to: Point) => {
  const dLat = degreesToRadians(to[1] - from[1]);
  const dLon = degreesToRadians(to[0] - from[0]);
  const lat1 = degreesToRadians(from[1]);
  const lat2 = degreesToRadians(to[1]);

  const a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

  return earthDiameter * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * A trip consists of many maneuvers: assume that each maneuver is transversed in constant speed, so compute the duration for each line in a maneuver.
 * Recompute the distance, since the Valhalla distance calculation algorithm may differ from ours.
 */
export const timeManeuver = (manoevre: Point[], duration: Second): Millisecond[] => {
  const { distances, length } = manoevre.reduce(
    (acc, cur, i) => {
      if (i > 0) {
        const d = distance(cur, manoevre[i - 1]);
        acc.length += d;
        acc.distances.push(d);
      }
      return acc;
    },
    { distances: [], length: 0 } as { distances: Meter[]; length: Meter }
  );
  const speed = length / (1000 * duration);
  return distances.map((d) => Math.round(d / speed));
};

/** Decode the shape file and time the trip in detail */
export const convertAndTimeTrip = (
  trip: Trip<LegWithManeuvers>
): { coordinates: Point[]; durations: Second[] } | undefined => {
  const leg = trip.legs.shift();
  if (!leg) return;
  const { maneuvers = [], shape } = leg;
  const coordinates = decodePolyline(shape);
  const durations = maneuvers.reduce((acc, maneuver) => {
    const { begin_shape_index, end_shape_index, length, time } = maneuver;
    if (time === 0 || length === 0 || begin_shape_index === end_shape_index) return acc;
    const segment = coordinates.slice(begin_shape_index, end_shape_index + 1);
    const durations = timeManeuver(segment, time);
    return [...acc, ...durations];
  }, [] as Second[]);
  return { coordinates, durations };
};
