import { logAnswer, readData } from '../../../utils';

import { Position } from './classes';

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
})
  .map((nextLine) => nextLine.trim())
  .filter((nextLine) => Boolean(nextLine));

// console.log({ DATA });
// console.log(`Total points = ${DATA.length * DATA[0]!.length}`);

// Derive "constants"
const STARTING_ROW = DATA.findIndex((nextLine) => nextLine.includes('S'));
const STARTING_COL = DATA[STARTING_ROW]!.indexOf('S');
const ENDING_ROW = DATA.findIndex((nextLine) => nextLine.includes('E'));
const ENDING_COL = DATA[ENDING_ROW]!.indexOf('E');
const GRID = DATA.map((nextLine) => nextLine.split('')).map((nextLine) =>
  nextLine.map((nextHeight) =>
    nextHeight === 'S' ? 0 : nextHeight === 'E' ? 25 : nextHeight.charCodeAt(0) - 97,
  ),
);

// Populate static vars in the Position class
Position.GRID = GRID;
Position.START_COORDS = [STARTING_ROW, STARTING_COL];
Position.END_COORDS = [ENDING_ROW, ENDING_COL];
Position.init();

// Get shortest
const getShortestDistance = (isPartOne: boolean): number => {
  Position.isPartOne = isPartOne;
  const startingPosition = isPartOne ? Position.START_POS : Position.END_POS;
  const distances = new Map<string, number>();
  distances.set(startingPosition.coords, 0);
  const toVisit: Position[] = [startingPosition];
  let shortestDistance: number;

  while (toVisit.length > 0) {
    const nextPos = toVisit.shift()!;
    const thisDistance = distances.get(nextPos.coords)!;
    if (nextPos.isFinished) {
      shortestDistance = thisDistance;
      break;
    }

    const { row, col } = nextPos;
    const neighbours = [
      new Position(row - 1, col),
      new Position(row + 1, col),
      new Position(row, col - 1),
      new Position(row, col + 1),
    ];
    const validNeighbours = neighbours.filter((nextNeighbour) => {
      const isValid = nextNeighbour.isValid && !distances.has(nextNeighbour.coords);
      const heightIsOk = isPartOne
        ? nextNeighbour.height <= nextPos.height + 1
        : nextNeighbour.height >= nextPos.height - 1;
      return isValid && heightIsOk;
    });
    for (const nextNeighbour of validNeighbours) {
      toVisit.push(nextNeighbour);
      distances.set(nextNeighbour.coords, thisDistance + 1);
    }
  }

  return shortestDistance!;
};

const runOne = () => {
  logAnswer(1, getShortestDistance(true));
};

const runTwo = () => {
  logAnswer(2, getShortestDistance(false));
};

export default async function () {
  runOne();
  runTwo();
}
