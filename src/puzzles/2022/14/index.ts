/* eslint-disable complexity */
import { logAnswer, readData } from '../../../utils';

type CountTotalSandFn = (opts: { hasFloor: boolean }) => number;

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
})
  .map((nextLine) => nextLine.trim()) // Remove whitespace on each line
  .slice(0, -1) // Remove last line as it will always be blank
  .filter((nextLine) => Boolean(nextLine)); // Remove any blank lines

// console.log({ DATA });

const SAND_ORIGIN_X = 500;
const SAND_ORIGIN_Y = 0;

const countTotalSand: CountTotalSandFn = ({ hasFloor }) => {
  const filledCoords = new Set<string>();
  let lowestRockY = 0;
  let leftMostRockX = Number.POSITIVE_INFINITY;
  let rightMostRockX = 0;

  // Helper to add coords and update bounds
  const fillCoords = (type: 'rock' | 'sand', x: number, y: number) => {
    filledCoords.add([x, y].join(','));
    if (type === 'rock') {
      if (y > lowestRockY) {
        lowestRockY = y;
      }
      if (x < leftMostRockX) {
        leftMostRockX = x;
      }
      if (x > rightMostRockX) {
        rightMostRockX = x;
      }
    }
  };

  // Helper to check if rock or sand exists at coords
  const coordsAreEmpty = (x: number, y: number) => !filledCoords.has([x, y].join(','));

  // Build set of all points with rock
  for (const nextLine of DATA) {
    // Convert next line into series of coords
    const points = nextLine
      .split(' -> ')
      .map((nextPoint) => nextPoint.split(',').map((nextCoord) => Number.parseInt(nextCoord, 10)));

    // If there's only one point on the line, store it then move on
    if (points.length === 1) {
      fillCoords('rock', points[0]![0]!, points[0]![1]!);
      continue;
    }

    // Skip the first point, as we'll look back one each time
    for (let pointIdx = 1; pointIdx < points.length; pointIdx++) {
      const firstPoint = points[pointIdx - 1]!;
      const secondPoint = points[pointIdx]!;
      // console.log({ firstPoint, secondPoint });
      if (firstPoint[0] === secondPoint[0]) {
        // Vertical line
        const xCoord = firstPoint[0]!;
        const [firstY, secondY] = ([firstPoint[1], secondPoint[1]] as [number, number]).sort(
          (a, b) => a - b,
        );
        // console.log({ firstY, secondY });
        for (let yCoord = firstY; yCoord <= secondY; yCoord++) {
          fillCoords('rock', xCoord, yCoord);
          // console.log('Adding:', { xCoord, yCoord });
        }
      } else if (firstPoint[1] === secondPoint[1]) {
        // Horizontal line
        const yCoord = firstPoint[1]!;
        const [firstX, secondX] = ([firstPoint[0], secondPoint[0]] as [number, number]).sort(
          (a, b) => a - b,
        );
        // console.log({ firstX, secondX });
        for (let xCoord = firstX; xCoord <= secondX; xCoord++) {
          fillCoords('rock', xCoord, yCoord);
          // console.log('Adding:', { xCoord, yCoord });
        }
      } else {
        throw new Error(
          `Invalid line between coords: ${firstPoint} and ${secondPoint} (should be horizontal or vertical)`,
        );
      }
    }
  }

  // Start filling with sand
  let sandCount = 0;
  let isFull = false;
  while (!isFull) {
    // Check if sand origin is full
    if (!coordsAreEmpty(SAND_ORIGIN_X, SAND_ORIGIN_Y)) {
      // console.log("It's now full!");
      isFull = true;
      break;
    }

    // Add another sand particle
    const mutableSandCoords = [SAND_ORIGIN_X, SAND_ORIGIN_Y];
    sandCount++;

    // console.log(`Sand particle: ${sandCount}`);

    // Move the sand down until it stops or goes out of bounds
    let sandStillMoving = true;
    while (sandStillMoving && !isFull) {
      if (hasFloor && mutableSandCoords[1] === lowestRockY + 1) {
        // Sand has stopped moving on the floor
        // console.log(`Sand has come to rest on the floor at ${mutableSandCoords}`);
        sandStillMoving = false;
        fillCoords('sand', mutableSandCoords[0]!, mutableSandCoords[1]!);
      } else if (coordsAreEmpty(mutableSandCoords[0]!, mutableSandCoords[1]! + 1)) {
        // Move sand down
        // console.log('Move down');
        mutableSandCoords[1] += 1;
      } else if (coordsAreEmpty(mutableSandCoords[0]! - 1, mutableSandCoords[1]! + 1)) {
        // Move sand down and left
        // console.log('Move down and left');
        mutableSandCoords[0] -= 1;
        mutableSandCoords[1] += 1;
      } else if (coordsAreEmpty(mutableSandCoords[0]! + 1, mutableSandCoords[1]! + 1)) {
        // Move sand down and right
        // console.log('Move down and right');
        mutableSandCoords[0] += 1;
        mutableSandCoords[1] += 1;
      } else {
        // Sand has stopped moving
        // console.log(`Sand has come to rest at ${mutableSandCoords}`);
        sandStillMoving = false;
        fillCoords('sand', mutableSandCoords[0]!, mutableSandCoords[1]!);
      }

      // console.log('Updated coords:', mutableSandCoords);

      // Check if out of bounds (i.e. full), but ignore this check when there is a floor
      if (
        !hasFloor &&
        (mutableSandCoords[1]! >= lowestRockY ||
          mutableSandCoords[0]! > rightMostRockX ||
          mutableSandCoords[0]! < leftMostRockX)
      ) {
        // console.log({ leftMostRockX, lowestRockY, rightMostRockX });
        // console.log("It's full  ... this sand particle doesn't count!");
        sandCount--;
        isFull = true;
      }
    }
  }

  return sandCount;
};

const runOne = () => {
  const sandCount = countTotalSand({ hasFloor: false });

  logAnswer(1, sandCount);
};

const runTwo = () => {
  const sandCount = countTotalSand({ hasFloor: true });

  logAnswer(2, sandCount);
};

export default async function () {
  runOne();
  runTwo();
}
