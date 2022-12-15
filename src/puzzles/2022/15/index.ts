/* eslint-disable canonical/filename-match-regex */
/* eslint-disable complexity */
import type { Bounds, Coords } from './helpers';

import { logAnswer, readData } from '../../../utils';

import { Sensor } from './helpers';

interface RegexGroups {
  beaconX: number;
  beaconY: number;
  sensorX: number;
  sensorY: number;
}

const USE_TEST_DATA = false;
const DATA = readData({
  importUrl: import.meta.url,
  useTestData: USE_TEST_DATA,
})
  .map((nextLine) => nextLine.trim()) // Remove whitespace on each line
  .slice(0, -1) // Remove last line as it will always be blank
  .filter((nextLine) => Boolean(nextLine)); // Remove any blank lines

// console.log({ DATA });

const SENSOR_DATA_REGEX =
  /^Sensor at x=(?<sensorX>-?\d+), y=(?<sensorY>-?\d+): closest beacon is at x=(?<beaconX>-?\d+), y=(?<beaconY>-?\d+)$/u;

const getDistance = (coords1: Coords, coords2: Coords) => {
  const [firstX, firstY] = coords1;
  const [secondX, secondY] = coords2;
  return Math.abs(firstX - secondX) + Math.abs(firstY - secondY);
};

const runOne = () => {
  const sensors: Sensor[] = [];
  const allBeacons = new Set<string>();

  const totalBounds: Pick<Bounds, 'maxX' | 'minX'> = {
    maxX: Number.NEGATIVE_INFINITY,
    minX: Number.POSITIVE_INFINITY,
  };

  for (const nextLine of DATA) {
    // Parse the line with regex
    const match = SENSOR_DATA_REGEX.exec(nextLine);
    if (match) {
      // Extract the values
      const { sensorX, sensorY, beaconX, beaconY } = Object.entries(match.groups!).reduce(
        (acc, [key, value]) => {
          acc[key as keyof RegexGroups] = Number.parseInt(value, 10);
          return acc;
        },
        // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
        {} as RegexGroups,
      );

      // Store the beacon
      const beaconCoords: Coords = [beaconX, beaconY];
      allBeacons.add(beaconCoords.join(','));

      // Add the sensor to the collection
      const sensorCoords: Coords = [sensorX, sensorY];
      const beaconDistance = getDistance(sensorCoords, beaconCoords);
      const nextSensor = new Sensor({ beaconDistance, coords: sensorCoords });
      sensors.push(nextSensor);

      // Update bounds
      totalBounds.maxX = Math.max(totalBounds.maxX, nextSensor.bounds.maxX);
      totalBounds.minX = Math.min(totalBounds.minX, nextSensor.bounds.minX);
    } else {
      throw new Error(`Invalid line: "${nextLine}"`);
    }
  }

  // console.log({ allBeacons, totalBounds });

  const rowToCheck = USE_TEST_DATA ? 10 : 2_000_000;
  const rowNoBeacons = new Set<number>();
  for (let x = totalBounds.minX; x <= totalBounds.maxX; x++) {
    const nextCoord: Coords = [x, rowToCheck];
    const coordString = nextCoord.join(',');
    for (const nextSensor of sensors) {
      const withinSensorRange = nextSensor.rangeContains(nextCoord);
      const isBeacon = allBeacons.has(coordString);
      if (withinSensorRange && !isBeacon) {
        rowNoBeacons.add(x);
      }
    }
  }

  logAnswer(1, rowNoBeacons.size);
};

const runTwo = () => {
  logAnswer(2, undefined);
};

export default async function () {
  runOne();
  runTwo();
}
