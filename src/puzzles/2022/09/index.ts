/* eslint-disable no-lonely-if */

import { logAnswer, readData } from '../../../utils';

type Location = [number, number];
type Direction = 'D' | 'L' | 'R' | 'U';

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
});

// console.log({ DATA });

const moveLeadingKnot = (loc: Location, dir: Direction): Location => {
  const leadingKnot = [...loc] as Location;

  switch (dir) {
    case 'D':
      leadingKnot[1] -= 1;
      break;
    case 'L':
      leadingKnot[0] -= 1;
      break;
    case 'R':
      leadingKnot[0] += 1;
      break;
    case 'U':
      leadingKnot[1] += 1;
      break;
    default:
      throw new Error(`Unknown direction: ${dir}`);
  }

  return leadingKnot;
};

const getNewTrailingKnotLoc = (leadingKnot: Location, trailingKnot: Location): Location => {
  const firstKnot = [...leadingKnot] as Location;
  const secondKnot = [...trailingKnot] as Location;
  const [firstX, firstY] = [...firstKnot];
  const [secondX, secondY] = [...secondKnot];
  const xDistance = Math.abs(firstX - secondX);
  const yDistance = Math.abs(firstY - secondY);

  if (xDistance <= 1 && yDistance <= 1) {
    // All good
  } else if (xDistance === 2 && yDistance === 0) {
    // Close the xDistance
    if (firstX > secondX) {
      secondKnot[0] += 1;
    } else {
      secondKnot[0] -= 1;
    }
  } else if (xDistance === 0 && yDistance === 2) {
    // Close the yDistance
    if (firstY > secondY) {
      secondKnot[1] += 1;
    } else {
      secondKnot[1] -= 1;
    }
  } else if (xDistance === 2 && yDistance === 2) {
    // Close both distances
    if (firstX > secondX) {
      secondKnot[0] += 1;
    } else {
      secondKnot[0] -= 1;
    }
    if (firstY > secondY) {
      secondKnot[1] += 1;
    } else {
      secondKnot[1] -= 1;
    }
  } else if (xDistance > yDistance) {
    // Match secondY to firstY
    secondKnot[1] = firstY;
    if (firstX > secondX) {
      secondKnot[0] += 1;
    } else {
      secondKnot[0] -= 1;
    }
  } else {
    // Match secondX to firstX
    secondKnot[0] = firstX;
    if (firstY > secondY) {
      secondKnot[1] += 1;
    } else {
      secondKnot[1] -= 1;
    }
  }

  return secondKnot;
};

const getTailLocs = (numKnots: number) => {
  const tailLocs = new Set<string>();
  const addTailKnotLoc = (newTailLoc: Location) => tailLocs.add(newTailLoc.join(','));

  const allKnots: Location[] = Array.from<Location>({ length: numKnots }).fill([0, 0]);

  for (const nextInstruction of DATA) {
    // Parse instruction
    const [dir, distStr] = nextInstruction.split(' ') as [Direction, string];
    const dist = Number.parseInt(distStr, 10);

    // Repeat for specified distance
    for (let moveIdx = 0; moveIdx < dist; moveIdx++) {
      // Move first knot
      allKnots[0] = moveLeadingKnot(allKnots[0]!, dir);
      // Repeat for each trailing knot in the rope
      for (let knotIdx = 1; knotIdx < numKnots; knotIdx++) {
        allKnots[knotIdx] = getNewTrailingKnotLoc(allKnots[knotIdx - 1]!, allKnots[knotIdx]!);
      }
      addTailKnotLoc(allKnots[numKnots - 1]!);
    }
  }

  return tailLocs;
};

const runOne = () => {
  logAnswer(1, getTailLocs(2).size);
};

const runTwo = () => {
  logAnswer(2, getTailLocs(10).size);
};

export default async function () {
  runOne();
  runTwo();
}
