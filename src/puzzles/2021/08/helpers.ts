// /* eslint-disable canonical/id-match */

import fs from 'fs';
import path from 'path';

import mapValues from 'lodash/mapValues';

interface ParseInputArgs {
  test: boolean;
}

interface SignalsEntry {
  outputDigits: [Wire[], Wire[], Wire[], Wire[]];
  signalPatterns: Wire[][];
}

interface InputData {
  entries: SignalsEntry[];
}

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Wire = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
type DigitToWires = Record<Digit, Wire[]>;

export const DIGIT_TO_WIRES: DigitToWires = {
  0: ['a', 'b', 'c', 'e', 'f', 'g'],
  1: ['c', 'f'],
  2: ['a', 'c', 'd', 'e', 'g'],
  3: ['a', 'c', 'd', 'f', 'g'],
  4: ['b', 'c', 'd', 'f'],
  5: ['a', 'b', 'd', 'f', 'g'],
  6: ['a', 'b', 'd', 'e', 'f', 'g'],
  7: ['a', 'c', 'f'],
  8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  9: ['a', 'b', 'c', 'd', 'f', 'g'],
};

export const DIGIT_TO_NUM_WIRES = mapValues(DIGIT_TO_WIRES, (wires) => {
  return wires.length;
});

export const NUM_WIRES_TO_DIGITS: Digit[][] = [];
for (const [digit, numWires] of Object.entries(DIGIT_TO_NUM_WIRES)) {
  const digits: Digit[] = NUM_WIRES_TO_DIGITS[numWires] ?? [];
  digits.push(digit as Digit);
  NUM_WIRES_TO_DIGITS[numWires] = digits;
}

// console.log({
//   DIGIT_TO_NUM_WIRES,
//   DIGIT_TO_WIRES,
//   NUM_WIRES_TO_DIGITS,
// });

//   0:      1:      2:      3:      4:
//  aaaa    ....    aaaa    aaaa    ....
// b    c  .    c  .    c  .    c  b    c
// b    c  .    c  .    c  .    c  b    c
//  ....    ....    dddd    dddd    dddd
// e    f  .    f  e    .  .    f  .    f
// e    f  .    f  e    .  .    f  .    f
//  gggg    ....    gggg    gggg    ....
//   6        2       5       5       4

//   5:      6:      7:      8:      9:
//  aaaa    aaaa    aaaa    aaaa    aaaa
// b    .  b    .  .    c  b    c  b    c
// b    .  b    .  .    c  b    c  b    c
//  dddd    dddd    ....    dddd    dddd
// .    f  e    f  .    f  e    f  .    f
// .    f  e    f  .    f  e    f  .    f
//  gggg    gggg    ....    gggg    gggg
//    5      6        3       7       6

// const ENABLE_LOGGING = true;
const HERE = path.dirname(import.meta.url).slice('file:'.length);
const FILENAME = {
  real: path.join(HERE, 'input.txt'),
  test: path.join(HERE, 'test-input.txt'),
};
const INPUT_LINE_REGEX = /([a-g ]+) \| ([a-g ]+)/u;

// const log = (...args: any[]) => {
//   if (ENABLE_LOGGING) {
//     console.log(...args);
//   }
// };

// interface InputData {
//   outputDigits: [Wire[], Wire[], Wire[], Wire[]];
//   signalPatterns: Wire[][];
// }

export const parseInput = ({ test }: ParseInputArgs): InputData | undefined => {
  // eslint-disable-next-line node/no-sync
  const input = fs.readFileSync(test ? FILENAME.test : FILENAME.real, 'utf8');
  const lines = input.split('\n');
  const entries = lines.map((nextLine) => {
    const match = INPUT_LINE_REGEX.exec(nextLine);
    if (!match) {
      return null;
    }

    const [, signals, output] = match;

    const outputDigits = output!.split(' ').map((nextDigit) => {
      return nextDigit.split('');
    });
    console.log({ outputDigits, signals });
    return {};
  });

  console.log({ entries });
  // return { entries };

  return undefined;
};
