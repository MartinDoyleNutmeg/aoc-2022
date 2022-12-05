/* eslint-disable unicorn/no-array-for-each */

import { logAnswer, readData } from '../../../utils';

interface StacksAndInstructions {
  instructions: Instruction[];
  stacks: string[][];
}

interface Instruction {
  from: number;
  instruction: string;
  numToMove: number;
  to: number;
}

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
});

const RE_INSTRUCTION = /^move (\d+) from (\d+) to (\d+)$/u;

const getStacksAndInstructions = (): StacksAndInstructions => {
  let lineIdx = 0;
  const stacks: string[][] = [];
  for (; lineIdx < DATA.length; lineIdx++) {
    const nextLine = DATA[lineIdx]!;
    if (nextLine === '') {
      break;
    }
    for (let charIdx = 0; charIdx < nextLine.length; charIdx += 4) {
      // eslint-disable-next-line unicorn/prefer-string-replace-all
      const crate = nextLine
        .slice(charIdx, charIdx + 4)
        .trim()
        .replace(/\[|\]/gu, '');
      if (crate === '' || /^\d+$/u.test(crate)) {
        continue;
      }
      const stackNum = Math.floor(charIdx / 4);
      const stack = stacks[stackNum] ?? (stacks[stackNum] = []);
      stack.push(crate);
    }
  }

  // Read the instructions
  const instructions: Instruction[] = [];
  for (; lineIdx < DATA.length; lineIdx++) {
    const instructionText = DATA[lineIdx]!;
    if (instructionText === '') {
      continue;
    }

    const matches = RE_INSTRUCTION.exec(instructionText)!;
    const numToMove = Number.parseInt(matches[1]!, 10);
    const from = Number.parseInt(matches[2]!, 10) - 1;
    const to = Number.parseInt(matches[3]!, 10) - 1;
    const instruction: Instruction = {
      from,
      instruction: instructionText,
      numToMove,
      to,
    };

    instructions.push(instruction);
  }

  return { instructions, stacks };
};

const runOne = () => {
  const { stacks, instructions } = getStacksAndInstructions();
  for (const nextInstruction of instructions) {
    const { from, numToMove, to } = nextInstruction;
    const fromStack = stacks[from] ?? (stacks[from] = []);
    const toStack = stacks[to] ?? (stacks[to] = []);
    for (let moveCounter = 0; moveCounter < numToMove; moveCounter++) {
      const crate = fromStack.shift();
      toStack.unshift(crate!);
    }
  }

  const topCrates = stacks.map((stack) => stack[0]);
  const answer = topCrates.join('');

  logAnswer(1, answer);
};

const runTwo = () => {
  const { stacks, instructions } = getStacksAndInstructions();
  for (const nextInstruction of instructions) {
    const { from, numToMove, to } = nextInstruction;
    const fromStack = stacks[from] ?? (stacks[from] = []);
    const toStack = stacks[to] ?? (stacks[to] = []);
    toStack.unshift(...fromStack.slice(0, numToMove));
    for (let moveCounter = 0; moveCounter < numToMove; moveCounter++) {
      fromStack.shift();
    }
  }

  const topCrates = stacks.map((stack) => stack[0]);
  const answer = topCrates.join('');

  logAnswer(2, answer);
};

export default async function () {
  runOne();
  runTwo();
}
