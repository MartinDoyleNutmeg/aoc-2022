import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { logAnswer } from '../../../utils';

const USE_TEST_DATA = false;
const THIS_FILENAME = url.fileURLToPath(import.meta.url);
const THIS_DIRNAME = path.dirname(THIS_FILENAME);
const DATA_FILENAME = USE_TEST_DATA ? 'test-data.txt' : 'data.txt';
const DATA_PATH = path.join(THIS_DIRNAME, DATA_FILENAME);

const untypedData = fs.readFileSync(DATA_PATH, 'utf8');
const data = untypedData as string;

const getCaloriesByElf = (): number[] => {
  const caloriesByElf: number[] = [];
  let nextTotal = 0;
  const lines = data.split('\n');
  for (const nextLine of lines) {
    const nextValue = nextLine.trim();
    if (nextValue.length === 0) {
      caloriesByElf.push(nextTotal);
      nextTotal = 0;
      continue;
    }
    const nextNumber = Number.parseInt(nextValue, 10);
    if (Number.isNaN(nextNumber)) {
      throw new TypeError(`Invalid number: ${nextValue}`);
    }
    nextTotal += nextNumber;
  }
  return caloriesByElf;
};

const runOne = () => {
  const caloriesByElf = getCaloriesByElf();
  // Sort in reverse order
  const sortedCalories = caloriesByElf.sort((a, b) => b - a);
  const maxCalories = sortedCalories.at(0);

  logAnswer(1, maxCalories);
};

const runTwo = () => {
  const caloriesByElf = getCaloriesByElf();
  // Sort in reverse order
  const sortedCalories = caloriesByElf.sort((a, b) => b - a);
  const topThreeCalories = sortedCalories
    .slice(0, 3)
    .reduce((prev, next) => prev + next, 0);

  logAnswer(2, topThreeCalories);
};

export default async function () {
  runOne();
  runTwo();
}
