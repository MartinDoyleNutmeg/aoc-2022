import { logAnswer } from '../../../utils';

import { parseInput } from './helpers';

const data = parseInput({ test: false });

const runOne = () => {
  let bestFuelCost = Number.MAX_SAFE_INTEGER;
  for (let nextTarget = data.minVal; nextTarget <= data.maxVal; nextTarget++) {
    let totalFuel = 0;
    for (const nextPos of data.positions) {
      totalFuel += Math.abs(nextTarget - nextPos);
    }

    if (totalFuel < bestFuelCost) {
      bestFuelCost = totalFuel;
    }
  }

  logAnswer(1, bestFuelCost);
};

const runTwo = () => {
  let bestFuelCost = Number.MAX_SAFE_INTEGER;
  for (let nextTarget = data.minVal; nextTarget <= data.maxVal; nextTarget++) {
    let totalFuel = 0;
    for (const nextPos of data.positions) {
      const numSteps = Math.abs(nextTarget - nextPos);
      const fuelCost = (numSteps ** 2 + numSteps) / 2;
      totalFuel += fuelCost;
    }

    if (totalFuel < bestFuelCost) {
      bestFuelCost = totalFuel;
    }
  }

  logAnswer(2, bestFuelCost);
};

export default async function () {
  runOne();
  runTwo();
}
