/* eslint-disable unicorn/no-array-for-each */

import { logAnswer, readData } from '../../../utils';

type ElfPairRanges = [number, number, number, number];

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
});
// console.log({ DATA });

const getElfRanges = (elfPair: string): ElfPairRanges =>
  elfPair
    .split(',')
    .flatMap((nextElf) => nextElf.split('-'))
    .map((rangeLimitStr) =>
      Number.parseInt(rangeLimitStr, 10),
    ) as ElfPairRanges;

const runOne = () => {
  let numContainingPairs = 0;
  for (const nextPair of DATA) {
    if (nextPair.trim() === '') {
      continue;
    }

    const [elf1Lower, elf1Upper, elf2Lower, elf2Upper] = getElfRanges(nextPair);
    if (elf1Lower >= elf2Lower && elf1Upper <= elf2Upper) {
      // elf1 inside elf2's range
      numContainingPairs += 1;
    } else if (elf2Lower >= elf1Lower && elf2Upper <= elf1Upper) {
      // elf2 inside elf1's range
      numContainingPairs += 1;
    }
  }

  logAnswer(1, numContainingPairs);
};

const runTwo = () => {
  let numOverlappingPairs = 0;
  for (const nextPair of DATA) {
    if (nextPair.trim() === '') {
      continue;
    }

    const [elf1Lower, elf1Upper, elf2Lower, elf2Upper] = getElfRanges(nextPair);
    if (elf1Lower >= elf2Lower && elf1Lower <= elf2Upper) {
      numOverlappingPairs += 1;
    } else if (elf1Upper >= elf2Lower && elf1Upper <= elf2Upper) {
      numOverlappingPairs += 1;
    } else if (elf2Lower >= elf1Lower && elf2Lower <= elf1Upper) {
      numOverlappingPairs += 1;
    } else if (elf2Upper >= elf1Lower && elf2Upper <= elf1Upper) {
      numOverlappingPairs += 1;
    }
  }

  logAnswer(2, numOverlappingPairs);
};

export default async function () {
  runOne();
  runTwo();
}
