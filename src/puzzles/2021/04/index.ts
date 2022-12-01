import { logAnswer } from '../../../utils';

import { parseInput } from './helpers';

const data = parseInput({ test: false });

const runOne = () => {
  let winningScore: number | undefined;
  data.numbers.some((numVal) => {
    for (const nextBoard of data.boards) {
      nextBoard.applyNumber(numVal);
      winningScore = nextBoard.getBoardScore();
      if (winningScore !== undefined) {
        break;
      }
    }

    return winningScore !== undefined;
  });
  logAnswer(1, winningScore!);
};

const runTwo = () => {
  for (const nextBoard of data.boards) {
    nextBoard.reset();
  }

  let winningScore: number | undefined;
  for (const numVal of data.numbers) {
    for (const nextBoard of data.boards) {
      if (!nextBoard.hasWon) {
        nextBoard.applyNumber(numVal);
        winningScore = nextBoard.getBoardScore();
      }
    }
  }

  logAnswer(2, winningScore!);
};

export default async function () {
  runOne();
  runTwo();
}
