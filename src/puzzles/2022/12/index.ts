import { logAnswer, readData } from '../../../utils';

import { Position } from './classes';

type ExploreFn = (
  pos: Position,
  visitedPath: string[],
  isPartOne: boolean,
) => void;

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
})
  .map((nextLine) => nextLine.trim())
  .filter((nextLine) => Boolean(nextLine));

// console.log({ DATA });
// console.log(`Total points = ${DATA.length * DATA[0]!.length}`);

const STARTING_ROW = DATA.findIndex((nextLine) => nextLine.includes('S'));
const STARTING_COL = DATA[STARTING_ROW]!.indexOf('S');
const ENDING_ROW = DATA.findIndex((nextLine) => nextLine.includes('E'));
const ENDING_COL = DATA[ENDING_ROW]!.indexOf('E');
const GRID = DATA.map((nextLine) => nextLine.split('')).map((nextLine) =>
  nextLine.map((nextHeight) =>
    nextHeight === 'S'
      ? 0
      : nextHeight === 'E'
      ? 25
      : nextHeight.charCodeAt(0) - 97,
  ),
);

const createPos = (row: number, col: number) => new Position(row, col, GRID);
const validPaths: string[][] = [];
const shortestJourneys = new Map<string, number>();

const explore: ExploreFn = (pos, visitedPath, isPartOne) => {
  const { row, col } = pos;

  // Check for finished
  const newPath = [...visitedPath, pos.coords];
  const finished = isPartOne
    ? pos.row === ENDING_ROW && pos.col === ENDING_COL
    : pos.height === 0;
  if (finished) {
    validPaths.push(newPath);
    return;
  }

  // See if any other path gets here quicker (if so, reject this path)
  const currentShortest = shortestJourneys.get(pos.coords);
  if (currentShortest && currentShortest <= newPath.length) {
    return;
  }
  shortestJourneys.set(pos.coords, newPath.length);

  // Keep exploring in each direction
  const up = createPos(row - 1, col);
  const down = createPos(row + 1, col);
  const left = createPos(row, col - 1);
  const right = createPos(row, col + 1);
  const nextPositions = [up, down, left, right].filter((nextDir) => {
    const isValid = nextDir.isValid && !visitedPath.includes(nextDir.coords);
    const heightIsOk = isPartOne
      ? nextDir.height <= pos.height + 1
      : nextDir.height >= pos.height - 1;
    return isValid && heightIsOk;
  });
  for (const nextPos of nextPositions) {
    explore(nextPos, newPath, isPartOne);
  }
};

const runOne = () => {
  shortestJourneys.clear();
  explore(createPos(STARTING_ROW, STARTING_COL), [], true);
  const [shortest] = [...validPaths].sort((a, b) => a.length - b.length);

  // const formattedPaths = sortedPaths.map((nextPath) => {
  //   const formatted = nextPath.map((nextPos) => {
  //     const [row, col] = nextPos.split(',').map(Number);
  //     const nextHeight = GRID[row!]![col!]!;
  //     const nextValue = String.fromCharCode(nextHeight + 97);
  //     return `${nextPos} (${nextValue})`;
  //   });
  //   return formatted;
  // });
  // Log all paths
  // for (const nextPath of formattedPaths)
  //   console.log(`Path length=${nextPath.length}:
  // ${nextPath.join(' → ')}`);
  // Log shortest path
  // console.log(`Shortest path length=${formattedPaths[0]!.length}:
  // ${formattedPaths[0]!.join(' → ')}`);

  // Path includes starting position, so subtract 1
  logAnswer(1, shortest!.length - 1);
};

const runTwo = () => {
  shortestJourneys.clear();
  explore(createPos(ENDING_ROW, ENDING_COL), [], false);
  const [shortest] = [...validPaths].sort((a, b) => a.length - b.length);

  // Path includes starting position, so subtract 1
  logAnswer(2, shortest!.length - 1);
};

export default async function () {
  runOne();
  runTwo();
}
