/* eslint-disable no-bitwise */
import { logAnswer, readData } from '../../../utils';

declare global {
  interface String {
    binary: number;
  }
}
// eslint-disable-next-line no-extend-native
Object.defineProperty(String.prototype, 'binary', {
  get() {
    return Number.parseInt(this, 2);
  },
});

const USE_TEST_DATA = true;
const DATA = readData({
  importUrl: import.meta.url,
  useTestData: USE_TEST_DATA,
})
  .map((nextLine) => nextLine.trim()) // Remove whitespace on each line
  .slice(0, -1) // Remove last line as it will always be blank
  .filter((nextLine) => Boolean(nextLine)); // Remove any blank lines
const ROCKS = [
  ['1111'],
  ['010', '111', '010'],
  ['001', '001', '111'],
  ['1', '1', '1', '1'],
  ['11', '11'],
].map((nextRock) => nextRock.map((nextLine) => nextLine.binary));

console.log({ DATA, ROCKS });

const isClash = (rockLine: number, chamberLine: number): boolean =>
  (rockLine ^ chamberLine) - chamberLine === rockLine;
const canGoRight = (rock: number, chamberLine: number) =>
  !isClash(1, rock) && !isClash(rock >> 1, chamberLine);

const runOne = () => {
  const PuzzleParams = {
    CHAMBER_WIDTH: 7,
    START_ABOVE: 3,
    START_LEFT: 2,
    TEST_AFTER: 2_022,
  };
  const canGoLeft = (rock: number, chamberLine: number) =>
    !isClash(2 ** PuzzleParams.CHAMBER_WIDTH - 1, rock) && !isClash(rock << 1, chamberLine);

  const chamber = [];
  for (let rockIdx = 0; rockIdx < PuzzleParams.TEST_AFTER; rockIdx++) {
    // Make sure there are three empty rows at the top
    const nextRockLines = ROCKS[rockIdx % ROCKS.length]!;
    while ( chamber.at(0 - (nextRockLines.length+3)) !== 0) {
      chamber.push(0);
    }

    let lastRockRow = chamber.length;
    let rockStillFalling = true;
    while (rockStillFalling) {
      for (const nextDir of DATA[0]!) {
        if (nextDir === '<') {

          const canGoLeft =
          if (canGoLeft(nextRockLines[0], chamber[lastRockRow])) {
            lastRockRow--;
          }
        } else if (nextDir === '>') {
          if (canGoRight(nextRockLines[0], chamber[lastRockRow])) {
            lastRockRow++;
          }
        }
      }
    }

    // Remove three empty rows at the top
    chamber.splice(-3, 3);
  }

  logAnswer(1, undefined);
};

const runTwo = () => {
  logAnswer(2, undefined);
};

export default async function () {
  runOne();
  runTwo();
}
