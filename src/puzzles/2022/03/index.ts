/* eslint-disable unicorn/no-array-for-each */

import { logAnswer, readData } from '../../../utils';

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
});

const PRIORITIES: Record<string, number> = {};
const LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
LOWER_CASE.split('').forEach((letter, index) => {
  PRIORITIES[letter] = index + 1;
});
UPPER_CASE.split('').forEach((letter, index) => {
  PRIORITIES[letter] = index + 27;
});
// console.log({ DATA, PRIORITIES });

const getCommonItemBetweenRucksacksPair = (rucksacks: string): string => {
  const itemsPerRucksack = rucksacks.length / 2;
  const rucksacksItems = rucksacks.split('');
  const firstRucksackItems = new Set(rucksacksItems.slice(0, itemsPerRucksack));

  let commonItem: string;
  for (const nextItem of rucksacksItems.slice(itemsPerRucksack)) {
    if (firstRucksackItems.has(nextItem)) {
      commonItem = nextItem;
      break;
    }
  }

  return commonItem!;
};

const getBadgeItem = (rucksacks: string[]): string => {
  const firstRucksackItems = new Set(rucksacks[0]!.split(''));
  const itemsInFirstAndSecond = new Set();
  for (const nextItem of rucksacks[1]!.split('')) {
    if (firstRucksackItems.has(nextItem)) {
      itemsInFirstAndSecond.add(nextItem);
    }
  }
  let badgeItem: string;
  for (const nextItem of rucksacks[2]!.split('')) {
    if (itemsInFirstAndSecond.has(nextItem)) {
      badgeItem = nextItem;
      break;
    }
  }

  return badgeItem!;
};

const runOne = () => {
  let prioritiesSum = 0;

  for (const nextLine of DATA) {
    if (nextLine === '') {
      continue;
    }
    const commonItem = getCommonItemBetweenRucksacksPair(nextLine);
    prioritiesSum += PRIORITIES[commonItem]!;
  }

  logAnswer(1, prioritiesSum);
};

const runTwo = () => {
  let prioritiesSum = 0;

  // eslint-disable-next-line id-length
  for (let i = 0; i < DATA.length - 2; i += 3) {
    const groupRucksacks = [DATA[i]!, DATA[i + 1]!, DATA[i + 2]!];
    const badgeItem = getBadgeItem(groupRucksacks);

    prioritiesSum += PRIORITIES[badgeItem]!;
  }

  logAnswer(2, prioritiesSum);
};

export default async function () {
  runOne();
  runTwo();
}
