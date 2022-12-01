import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import {
  logComplete,
  logError,
  logPuzzleDay,
  logStart,
  logTime,
} from './utils';

const HERE = path.dirname(import.meta.url).slice('file:'.length);
const RELATIVE_PATH_REGEX = /(\d{4})\/(\d{2})$/u;

const sortStringsNumerically = (a: string, b: string) => {
  const aNum = Number.parseInt(a, 10);
  const bNum = Number.parseInt(b, 10);
  return aNum - bNum;
};

const run = async () => {
  const [runAllArg] = process.argv.slice(2);
  const runAll = runAllArg === '--runAll';

  // Get years
  const puzzlesPath = path.join(HERE, 'puzzles');
  const yearFolders = (await fs.readdir(puzzlesPath)).sort(
    sortStringsNumerically,
  );

  // Get paths to all puzzles for each year
  const allPuzzlePaths = [];
  for (const nextYear of yearFolders) {
    const nextYearPath = path.join(puzzlesPath, nextYear);
    const puzzleDays = (await fs.readdir(nextYearPath)).sort(
      sortStringsNumerically,
    );
    for (const nextDay of puzzleDays) {
      const nextDayPath = path.join(nextYearPath, nextDay);
      allPuzzlePaths.push(nextDayPath);
    }
  }

  // Run through puzzles
  logStart();
  const beforeAll = performance.now();
  const startIndex = runAll ? 0 : allPuzzlePaths.length - 1;
  for (let index = startIndex; index < allPuzzlePaths.length; index++) {
    const nextPuzzlePath = allPuzzlePaths[index]!;
    const relativePath = `./${path.relative(HERE, nextPuzzlePath)}`;
    const [, year, day] = RELATIVE_PATH_REGEX.exec(relativePath)!;
    const runNextDay = (await import(relativePath)).default;
    logPuzzleDay(year!, day!);
    const before = performance.now();
    await runNextDay();
    logTime(before);
  }

  // Finish up with nice message
  logComplete(beforeAll);
};

run().catch((error) => {
  logError('Error running program', error);
});
