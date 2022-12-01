import { logAnswer } from '../../../utils';

import { logMap, parseInput } from './helpers';

const runOne = () => {
  const data = parseInput({ test: false });
  const numDays = 80;
  for (let day = 1; day <= numDays; day++) {
    const numNewFish = data.get(0)!;
    for (let timer = 1; timer <= 8; timer++) {
      data.set(timer - 1, data.get(timer)!);
    }

    data.set(8, numNewFish);
    data.set(6, data.get(6)! + numNewFish);

    logMap(`After day ${day}`, data);
  }

  let totalFish = 0;
  for (const fishCount of data.values()) {
    totalFish += fishCount;
  }

  logAnswer(1, totalFish);
};

const runTwo = () => {
  const data = parseInput({ test: false });
  const numDays = 256;
  for (let day = 1; day <= numDays; day++) {
    const numNewFish = data.get(0)!;
    for (let timer = 1; timer <= 8; timer++) {
      data.set(timer - 1, data.get(timer)!);
    }

    data.set(8, numNewFish);
    data.set(6, data.get(6)! + numNewFish);

    logMap(`After day ${day}`, data);
  }

  let totalFish = 0;
  for (const fishCount of data.values()) {
    totalFish += fishCount;
  }

  logAnswer(2, totalFish);
};

export default async function () {
  runOne();
  runTwo();
}
