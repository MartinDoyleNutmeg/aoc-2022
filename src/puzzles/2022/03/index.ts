/* eslint-disable id-length */

import { logAnswer, readData } from '../../../utils';

const USE_TEST_DATA = true;
const DATA = readData({
  importUrl: import.meta.url,
  useTestData: USE_TEST_DATA,
});

const runOne = () => {
  console.log('DATA', DATA);

  logAnswer(1, undefined);
};

const runTwo = () => {
  logAnswer(2, undefined);
};

export default async function () {
  runOne();
  runTwo();
}
