/* eslint-disable no-lonely-if */

import { logAnswer, readData } from '../../../utils';

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
});

// console.log({ DATA });

const getRegisterValuesPerCycle = (): number[] => {
  const instructions = DATA.filter((line) => line.trim() !== '');
  // NOTE: Cycle values are stored zero-indexed, but the cycle number is 1-indexed
  const valuesPerCycle: number[] = [];
  let registerValue = 1;
  let valueToAdd: number | undefined;
  let skipCounter = 0;
  let finished = false;

  for (let cycleIdx = 0; cycleIdx < 240; cycleIdx++) {
    // Perform action this cycle, or still in progress?
    if (skipCounter > 0) {
      // console.log(`Value during cycle ${cycleIdx + 1}: ${registerValue}`);
      valuesPerCycle.push(registerValue);
      skipCounter--;
      continue;
    }

    // Apply value at very start of cycle
    if (valueToAdd) {
      // console.log(`Adding ${valueToAdd} to register`);
      registerValue += valueToAdd;
      valueToAdd = undefined;
    }

    // Store the value for this cycle
    // console.log(`Value during cycle ${cycleIdx + 1}: ${registerValue}`);
    valuesPerCycle.push(registerValue);

    // If we have no more instructions, just keep cycling
    if (finished) {
      continue;
    }

    // Pick up the next instruction
    const nextInstruction = instructions.shift();
    if (nextInstruction === undefined) {
      // Ran out of instructions
      console.log(`Ran out of instructions on cycle ${cycleIdx + 1}`);
      finished = true;
      continue;
    }

    // console.log(`Cycle ${cycleIdx + 1}: ${nextInstruction}`);

    // Determine the command
    const [command, value] = nextInstruction.split(' ');
    if (command === 'noop') {
      continue;
    }

    // Assign the add value
    valueToAdd = Number.parseInt(value!, 10);

    // Need to skip a cycle when performing an addx
    skipCounter = 1;
  }

  return valuesPerCycle;
};

const runOne = () => {
  const valuesPerCycle = getRegisterValuesPerCycle();

  // Retrieve the signal strengths and then sum them
  const signalStrengths: number[] = [];
  for (let cycleIdx = 19; cycleIdx < 220; cycleIdx += 40) {
    signalStrengths.push(valuesPerCycle[cycleIdx]! * (cycleIdx + 1));
  }
  const signalStrengthsSum = signalStrengths.reduce(
    (sum, value) => sum + value,
    0,
  );

  logAnswer(1, signalStrengthsSum);
};

const runTwo = () => {
  const valuesPerCycle = getRegisterValuesPerCycle();
  const rows: string[][] = [];

  for (let cycleIdx = 0; cycleIdx < 240; cycleIdx++) {
    const rowIdx = Math.floor(cycleIdx / 40);
    const colIdx = cycleIdx - 40 * rowIdx;

    // console.log({ colIdx, CYCLE: cycleIdx + 1, rowIdx });

    const cycleValue = valuesPerCycle[cycleIdx]!;
    const isLit = Math.abs(colIdx - cycleValue) < 2;

    rows[rowIdx] = rows[rowIdx] ?? [];
    // rows[rowIdx]![colIdx] = isLit ? '#' : '.';
    rows[rowIdx]![colIdx] = isLit ? '@' : ' ';
  }

  console.log(`Rendered screen:

${rows.map((nextRow) => nextRow.join('')).join('\n')}`);

  logAnswer(2, undefined);
};

export default async function () {
  runOne();
  runTwo();
}
