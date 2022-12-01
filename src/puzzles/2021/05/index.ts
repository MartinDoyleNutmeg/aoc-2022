import type { Point } from './helpers';

import { logAnswer } from '../../../utils';

import { parseInput } from './helpers';

const data = parseInput({ test: false });

const runOne = () => {
  const lineCounter: number[][] = [];
  const pointsWithTwoLines: Point[] = [];
  for (const ventLine of data) {
    for (const point of ventLine.getPoints(false)) {
      const row = lineCounter[point.y] ?? [];
      // eslint-disable-next-line no-multi-assign
      const newTotalLines = (row[point.x] = (row[point.x] ?? 0) + 1);
      lineCounter[point.y] = row;
      if (newTotalLines === 2) {
        pointsWithTwoLines.push(point);
      }
    }
  }

  logAnswer(1, pointsWithTwoLines.length);
};

const runTwo = () => {
  const lineCounter: number[][] = [];
  const pointsWithTwoLines: Point[] = [];
  for (const ventLine of data) {
    for (const point of ventLine.getPoints(true)) {
      const row = lineCounter[point.y] ?? [];
      // eslint-disable-next-line no-multi-assign
      const newTotalLines = (row[point.x] = (row[point.x] ?? 0) + 1);
      lineCounter[point.y] = row;
      if (newTotalLines === 2) {
        pointsWithTwoLines.push(point);
      }
    }
  }

  logAnswer(2, pointsWithTwoLines.length);
};

export default async function () {
  runOne();
  runTwo();
}
