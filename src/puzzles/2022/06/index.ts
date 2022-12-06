/* eslint-disable unicorn/no-array-for-each */

import { logAnswer, readData } from '../../../utils';

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
});
const STREAM = DATA[0]!;

const runOne = () => {
  let charIdx = 4;
  for (; charIdx < STREAM.length; charIdx++) {
    const lastFourChars = STREAM.slice(charIdx - 4, charIdx).split('');
    if (new Set(lastFourChars).size === 4) {
      break;
    }
  }

  logAnswer(1, charIdx);
};

const runTwo = () => {
  let charIdx = 14;
  for (; charIdx < STREAM.length; charIdx++) {
    const lastFourChars = STREAM.slice(charIdx - 14, charIdx).split('');
    if (new Set(lastFourChars).size === 14) {
      break;
    }
  }

  logAnswer(2, charIdx);
};

export default async function () {
  runOne();
  runTwo();
}
