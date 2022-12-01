import { logAnswer } from '../../../utils';

import untypedData from './data.json';

const data: number[] = untypedData;

const runOne = () => {
  let lastDepth: number | undefined;
  let increaseCounter = 0;
  for (const nextDepth of data) {
    if (lastDepth && nextDepth > lastDepth) {
      increaseCounter++;
    }

    lastDepth = nextDepth;
  }

  logAnswer(1, increaseCounter);
};

const runTwo = () => {
  let prevSum: number | undefined;
  let increaseCounter = 0;
  for (let dataIdx = 2; dataIdx < data.length; dataIdx++) {
    const [prevPrev, prev, curr] = data.slice(dataIdx - 2, dataIdx + 1);
    const sum = prevPrev! + prev! + curr!;
    if (prevSum && sum > prevSum) {
      increaseCounter++;
    }

    prevSum = sum;
  }

  logAnswer(2, increaseCounter);
};

export default async function () {
  runOne();
  runTwo();
}
