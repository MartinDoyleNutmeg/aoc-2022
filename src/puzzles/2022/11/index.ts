import { logAnswer, readData } from '../../../utils';

import { Monkey, Operation } from './monkey';

type ParseDataFn = (worryReductionFactor: number) => {
  modulo: number;
  monkeys: Monkey[];
};

type CalculateLevelOfMonkeyBusinessFn = (
  monkeys: Monkey[],
  numRounds: number,
  modulo: number,
) => number;

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
})
  .map((nextLine) => nextLine.trim())
  .filter((nextLine) => Boolean(nextLine));

const RegExps = {
  FALSE_MONKEY: /^If false: throw to monkey (\d+)$/u,
  MONKEY: /^Monkey (\d+):$/u,
  OPERATION: /^Operation: new = old (.+)$/u,
  STARTING_ITEMS: /^Starting items: ([\d, ]+)$/u,
  TEST: /^Test: divisible by (\d+)$/u,
  TRUE_MONKEY: /^If true: throw to monkey (\d+)$/u,
};

// console.log({ DATA });

const parseData: ParseDataFn = (worryReductionFactor) => {
  const monkeys: Monkey[] = [];
  let modulo = 1;

  for (let lineIdx = 0; lineIdx < DATA.length; lineIdx += 6) {
    const [, monkeyIdxStr] = RegExps.MONKEY.exec(DATA[lineIdx]!) ?? [];
    const [, startingItemsStr] =
      RegExps.STARTING_ITEMS.exec(DATA[lineIdx + 1]!) ?? [];
    const [, operationStr] = RegExps.OPERATION.exec(DATA[lineIdx + 2]!) ?? [];
    const [, testStr] = RegExps.TEST.exec(DATA[lineIdx + 3]!) ?? [];
    const [, trueMonkeyStr] =
      RegExps.TRUE_MONKEY.exec(DATA[lineIdx + 4]!) ?? [];
    const [, falseMonkeyStr] =
      RegExps.FALSE_MONKEY.exec(DATA[lineIdx + 5]!) ?? [];

    const monkeyIdx = Number(monkeyIdxStr);
    const startingItems = startingItemsStr!
      .split(', ')
      .map((nextItem) => Number(nextItem));
    let operation: Operation;
    if (operationStr === '* old') {
      operation = new Operation('**', 2);
    } else if (operationStr?.startsWith('*')) {
      operation = new Operation('*', Number(operationStr.slice(2)));
    } else if (operationStr?.startsWith('+')) {
      operation = new Operation('+', Number(operationStr.slice(2)));
    } else {
      throw new Error(`Unknown operation in "${operationStr}"`);
    }
    const testDivisor = Number(testStr);
    const [trueMonkey, falseMonkey] = [
      Number(trueMonkeyStr),
      Number(falseMonkeyStr),
    ];

    // In order to keep worry levels manageable (i.e. to not hit infinity), we need to find the lowest common multiple of all the test divisors. This will enable us to use that as the modulo for all the monkeys' items while still preserving the test logic.
    modulo *= testDivisor;

    // console.log({
    //   falseMonkey,
    //   monkeyIdx,
    //   operation,
    //   startingItems,
    //   test,
    //   trueMonkey,
    // });

    monkeys[monkeyIdx] = new Monkey({
      items: startingItems,
      monkeyIdx,
      operation,
      testDivisor,
      throwRecipients: [trueMonkey, falseMonkey],
      worryReductionFactor,
    });
  }

  return { modulo, monkeys };
};

const calculateLevelOfMonkeyBusiness: CalculateLevelOfMonkeyBusinessFn = (
  monkeys,
  numRounds,
  modulo,
) => {
  for (let roundIdx = 0; roundIdx < numRounds; roundIdx++) {
    for (const nextMonkey of monkeys) {
      const throwRecipients = nextMonkey.inspectAndThrow(modulo);
      // eslint-disable-next-line unicorn/no-for-loop
      for (
        let recipientIdx = 0;
        recipientIdx < throwRecipients.length;
        recipientIdx++
      ) {
        const items = throwRecipients[recipientIdx];
        if (items !== undefined) {
          for (const item of items) {
            monkeys[recipientIdx]!.catchItem(item);
          }
        }
      }
    }
    //     console.log(`After round ${roundIdx + 1}, monkeys are:
    // ${monkeys.map((monkey) => monkey.toString()).join('\n')}
    // `);
  }

  const inspectionCounts = monkeys.map((monkey) => monkey.inspections);
  const highestInspectionCounts = inspectionCounts
    .sort((a, b) => b - a)
    .slice(0, 2);
  const levelOfMonkeyBusiness = highestInspectionCounts.reduce(
    (acc, next) => acc * next,
    1,
  );

  // console.log({
  //   highestInspectionCounts,
  //   monkeys: monkeys.map((monkey) => monkey.toString()),
  // });

  return levelOfMonkeyBusiness;
};

const runOne = () => {
  const { monkeys, modulo } = parseData(3);
  const levelOfMonkeyBusiness = calculateLevelOfMonkeyBusiness(
    monkeys,
    20,
    modulo,
  );

  logAnswer(1, levelOfMonkeyBusiness);
};

const runTwo = () => {
  const { monkeys, modulo } = parseData(1);
  const levelOfMonkeyBusiness = calculateLevelOfMonkeyBusiness(
    monkeys,
    10_000,
    modulo,
  );

  logAnswer(2, levelOfMonkeyBusiness);
};

export default async function () {
  runOne();
  runTwo();
}
