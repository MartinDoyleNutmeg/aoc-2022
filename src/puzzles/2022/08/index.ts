/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable unicorn/no-for-loop */
/* eslint-disable unicorn/no-array-for-each */

import { logAnswer, readData } from '../../../utils';

type GetVisibleTreesFn = (params: {
  colIdx?: number;
  lineOfTrees: number[];
  rowIdx?: number;
}) => string[];

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
});

const ROWS = DATA.filter((line) => line.trim().length > 0).map((line) =>
  line.split('').map((treeHeightStr) => Number.parseInt(treeHeightStr, 10)),
);
const COLS = ROWS[0]!.map((_, colIdx) => ROWS.map((row) => row[colIdx]!));

const getVisibleTreeLocs: GetVisibleTreesFn = ({ lineOfTrees, colIdx, rowIdx }) => {
  const visibleTreeLocs: string[] = [];
  let highestForwardHeight = -1;
  let highestBackwardHeight = -1;

  for (
    // eslint-disable-next-line sort-vars
    let forwardIdx = 0, backwardIdx = lineOfTrees.length - 1;
    forwardIdx < lineOfTrees.length;
    forwardIdx++, backwardIdx--
  ) {
    const nextForwardHeight = lineOfTrees[forwardIdx]!;
    const nextBackwardHeight = lineOfTrees[backwardIdx]!;

    let forwardLoc = '';
    let backwardLoc = '';
    // eslint-disable-next-line no-negated-condition
    if (rowIdx !== undefined) {
      forwardLoc = `${rowIdx},${forwardIdx}`;
      backwardLoc = `${rowIdx},${backwardIdx}`;
    } else {
      forwardLoc = `${forwardIdx},${colIdx}`;
      backwardLoc = `${backwardIdx},${colIdx}`;
    }

    if (nextForwardHeight > highestForwardHeight) {
      visibleTreeLocs.push(forwardLoc);
      highestForwardHeight = nextForwardHeight;
    }
    if (nextBackwardHeight > highestBackwardHeight) {
      visibleTreeLocs.push(backwardLoc);
      highestBackwardHeight = nextBackwardHeight;
    }
  }

  return visibleTreeLocs;
};

const runOne = () => {
  const visibleTrees = new Set<string>();

  for (const [rowIdx, ROW] of ROWS.entries()) {
    const lineOfTrees = ROW!;
    const visibleTreeLocs = getVisibleTreeLocs({ lineOfTrees, rowIdx });
    visibleTreeLocs.forEach((nextLoc) => visibleTrees.add(nextLoc));
  }

  for (const [colIdx, COL] of COLS.entries()) {
    const lineOfTrees = COL!;
    const visibleTreeLocs = getVisibleTreeLocs({ colIdx, lineOfTrees });
    visibleTreeLocs.forEach((nextLoc) => visibleTrees.add(nextLoc));
  }

  logAnswer(1, visibleTrees.size);
};

const runTwo = () => {
  let highestScore = 0;

  for (let rowIdx = 0; rowIdx < ROWS.length; rowIdx++) {
    for (let colIdx = 0; colIdx < COLS.length; colIdx++) {
      const thisTree = ROWS[rowIdx]![colIdx]!;
      let up = 0;
      let down = 0;
      let right = 0;
      let left = 0;

      for (let rowPointer = rowIdx - 1; rowPointer >= 0; rowPointer--) {
        up = rowIdx - rowPointer;
        if (thisTree <= ROWS[rowPointer]![colIdx]!) {
          break;
        }
      }
      for (let rowPointer = rowIdx + 1; rowPointer < ROWS.length; rowPointer++) {
        down = rowPointer - rowIdx;
        if (thisTree <= ROWS[rowPointer]![colIdx]!) {
          break;
        }
      }
      for (let colPointer = colIdx + 1; colPointer < COLS.length; colPointer++) {
        right = colPointer - colIdx;
        if (thisTree <= ROWS[rowIdx]![colPointer]!) {
          break;
        }
      }
      for (let colPointer = colIdx - 1; colPointer >= 0; colPointer--) {
        left = colIdx - colPointer;
        if (thisTree <= ROWS[rowIdx]![colPointer]!) {
          break;
        }
      }

      // console.log(
      //   `At ${rowIdx},${colIdx} values are ${JSON.stringify({
      //     down,
      //     left,
      //     right,
      //     up,
      //   })}`,
      // );

      const treeScore = up * down * right * left;
      if (treeScore > highestScore) {
        highestScore = treeScore;
      }
    }
  }

  logAnswer(2, highestScore);
};

export default async function () {
  runOne();
  runTwo();
}
