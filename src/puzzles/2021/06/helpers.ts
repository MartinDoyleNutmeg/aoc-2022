/* eslint-disable canonical/id-match */

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

interface ParseInputArgs {
  test: boolean;
}

interface ParseInputArgs {
  test: boolean;
}

type InputData = Map<number, number>;

const ENABLE_LOGGING = false;
const HERE = path.dirname(import.meta.url).slice('file:'.length);

const log = (...args: any[]) => {
  if (ENABLE_LOGGING) {
    console.log(...args);
  }
};

export const logMap = (label: string, dataMap: InputData) => {
  const stringified = [...dataMap.values()].join(',');
  log(`${chalk.yellow.bold(`${label}:`)} ${stringified}
`);
};

export const parseInput = ({ test }: ParseInputArgs): InputData => {
  // Read input from disk
  const filename = test ? 'test-input.txt' : 'input.txt';
  const filepath = path.join(HERE, filename);
  // eslint-disable-next-line node/no-sync
  const input = fs.readFileSync(filepath, 'utf8');

  // Parse input
  const startingValues = new Map<number, number>([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
  ]);
  for (const nextValue of input.split(',')) {
    const numVal = Number.parseInt(nextValue, 10);
    startingValues.set(numVal, startingValues.get(numVal)! + 1);
  }

  logMap('Starting values', startingValues);

  return startingValues;
};
