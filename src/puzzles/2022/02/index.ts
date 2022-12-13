/* eslint-disable id-length */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { logAnswer } from '../../../utils';

type THEIRS = 'A' | 'B' | 'C';
type MINE = 'X' | 'Y' | 'Z';

const USE_TEST_DATA = false;
const THIS_FILENAME = url.fileURLToPath(import.meta.url);
const THIS_DIRNAME = path.dirname(THIS_FILENAME);
const DATA_FILENAME = USE_TEST_DATA ? 'test-data.txt' : 'data.txt';
const DATA_PATH = path.join(THIS_DIRNAME, DATA_FILENAME);
const Scores = {
  DRAW: 3,
  LOSS: 0,
  PAPER: 2,
  ROCK: 1,
  SCISSORS: 3,
  WIN: 6,
};

const untypedData = fs.readFileSync(DATA_PATH, 'utf8');
const data = untypedData as string;

const getScoreV1 = (theirChoice: THEIRS, myChoice: MINE): number => {
  let score = myChoice === 'X' ? Scores.ROCK : myChoice === 'Y' ? Scores.PAPER : Scores.SCISSORS;
  switch (myChoice) {
    // Rock
    case 'X':
      if (theirChoice === 'A') {
        score += Scores.DRAW;
      } else if (theirChoice === 'B') {
        score += Scores.LOSS;
      } else {
        score += Scores.WIN;
      }
      break;
    // Paper
    case 'Y':
      if (theirChoice === 'A') {
        score += Scores.WIN;
      } else if (theirChoice === 'B') {
        score += Scores.DRAW;
      } else {
        score += Scores.LOSS;
      }
      break;
    // Scissors
    default:
      if (theirChoice === 'A') {
        score += Scores.LOSS;
      } else if (theirChoice === 'B') {
        score += Scores.WIN;
      } else {
        score += Scores.DRAW;
      }
  }
  return score;
};

const getScoreV2 = (theirChoice: THEIRS, result: MINE): number => {
  let score = 0;
  switch (result) {
    // Loss
    case 'X':
      score += Scores.LOSS;
      if (theirChoice === 'A') {
        score += Scores.SCISSORS;
      } else if (theirChoice === 'B') {
        score += Scores.ROCK;
      } else {
        score += Scores.PAPER;
      }
      break;
    // Draw
    case 'Y':
      score += Scores.DRAW;
      if (theirChoice === 'A') {
        score += Scores.ROCK;
      } else if (theirChoice === 'B') {
        score += Scores.PAPER;
      } else {
        score += Scores.SCISSORS;
      }
      break;
    // Win
    default:
      score += Scores.WIN;
      if (theirChoice === 'A') {
        score += Scores.PAPER;
      } else if (theirChoice === 'B') {
        score += Scores.SCISSORS;
      } else {
        score += Scores.ROCK;
      }
  }
  return score;
};

const runOne = () => {
  const scores = data
    .split('\n')
    .filter((nextLine) => Boolean(nextLine.trim()))
    .map((nextLine) => {
      const [theirChoice, myChoice] = nextLine.split(' ');
      return getScoreV1(theirChoice as THEIRS, myChoice as MINE);
    });
  const total = scores.reduce((acc, next) => acc + next, 0);

  logAnswer(1, total);
};

const runTwo = () => {
  const scores = data
    .split('\n')
    .filter((nextLine) => Boolean(nextLine.trim()))
    .map((nextLine) => {
      const [theirChoice, myChoice] = nextLine.split(' ');
      return getScoreV2(theirChoice as THEIRS, myChoice as MINE);
    });
  const total = scores.reduce((acc, next) => acc + next, 0);

  logAnswer(2, total);
};

export default async function () {
  runOne();
  runTwo();
}
