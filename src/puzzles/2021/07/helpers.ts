/* eslint-disable canonical/id-match */

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

interface ParseInputArgs {
  test: boolean;
}

interface InputData {
  maxVal: number;
  minVal: number;
  positions: number[];
}

const ENABLE_LOGGING = false;
const HERE = path.dirname(import.meta.url).slice('file:'.length);
const FILENAME = {
  real: path.join(HERE, 'input.txt'),
  test: path.join(HERE, 'test-input.txt'),
};

const log = (...args: any[]) => {
  if (ENABLE_LOGGING) {
    console.log(...args);
  }
};

export const logData = (input: InputData) => {
  log(
    `${chalk.yellow.bold('Min:')}${input.minVal}, ${chalk.yellow.bold('Max:')}${
      input.maxVal
    }, ${chalk.yellow.bold('Total count:')} ${input.positions.length}`,
  );
};

export const parseInput = ({ test }: ParseInputArgs): InputData => {
  // eslint-disable-next-line node/no-sync
  const input = fs.readFileSync(test ? FILENAME.test : FILENAME.real, 'utf8');
  let minVal = Number.MAX_SAFE_INTEGER;
  let maxVal = 0;
  const positions = input.split(',').map((nextPos) => {
    const numVal = Number.parseInt(nextPos, 10);
    if (numVal > maxVal) {
      maxVal = numVal;
    }

    if (numVal < minVal) {
      minVal = numVal;
    }

    return numVal;
  });

  const parsed = {
    maxVal,
    minVal,
    positions,
  };
  logData(parsed);

  return parsed;
};
