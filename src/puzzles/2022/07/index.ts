/* eslint-disable unicorn/no-array-for-each */

import { logAnswer, readData } from '../../../utils';

import { Directory } from './directory';

const RE_COMMAND = /^\$ (?<command>cd|ls) ?(?<dir>.+)?$/u;
const RE_FILE_ENTRY = /^(?<size>\d+) (?<name>.+)$/u;
const RE_DIR_ENTRY = /^dir (?<dir>.+)$/u;

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
});

// console.log(`DATA:
// ${DATA.join('\n')}`);

const getDirectorySizes = () => {
  // Copy the data array to treat it like a stack
  const lines = [...DATA];
  const directorySizes: number[] = [];
  const ROOT_DIR = new Directory('/');
  let currentDir = ROOT_DIR;

  const parseNextLine = () => {
    // Grab the next line to parse
    const nextLine = lines.shift();
    // console.log(`nextLine="${nextLine}" (currentDir=${currentDir?.name})`);
    if (nextLine === undefined) {
      return;
    }

    // Skip first line
    if (nextLine === '$ cd /') {
      parseNextLine();
    }

    // Determine the next line type
    let match: RegExpExecArray | null;
    if (nextLine === '') {
      // Finished reading final directory
      const totalSize = currentDir.totalSize;
      directorySizes.push(totalSize);
      directorySizes.push(ROOT_DIR.totalSize);
    } else if ((match = RE_COMMAND.exec(nextLine))) {
      const { command, dir } = match.groups!;
      if (command === 'ls') {
        // Ignore ls command as it's implied by the next line
        parseNextLine();
      } else if (dir === '..') {
        // Finished listing current directory

        // Check size of current directory
        const totalSize = currentDir.totalSize;
        directorySizes.push(totalSize);

        // Go to parent directory
        if (currentDir.parent) {
          currentDir = currentDir.parent;
          parseNextLine();
        }
      } else {
        // Go to new directory
        currentDir = currentDir.subDirectories.find(
          ({ name }) => name === dir,
        )!;
        parseNextLine();
      }
    } else if ((match = RE_FILE_ENTRY.exec(nextLine))) {
      const { name, size } = match.groups!;
      currentDir.addFile(name!, Number(size));
      parseNextLine();
    } else if ((match = RE_DIR_ENTRY.exec(nextLine))) {
      const { dir } = match.groups!;
      currentDir.addDir(dir!);
      parseNextLine();
    } else {
      throw new Error(`Unknown line type: ${nextLine}`);
    }
  };

  // Start parsing
  parseNextLine();

  // Pass back the folder sizes
  return directorySizes;
};

const runOne = () => {
  const directorySizes = getDirectorySizes();
  const sumOfFoldersUnderLimit = directorySizes
    .filter((folderSize) => folderSize < 100_000)
    .reduce((acc, size) => acc + size, 0);

  logAnswer(1, sumOfFoldersUnderLimit);
};

const runTwo = () => {
  const directorySizes = getDirectorySizes();

  const TOTAL_FILE_SYSTEM_SIZE = 70_000_000;
  const MINIMUM_REQUIRED_SIZE = 30_000_000;
  const rootFolderSize = directorySizes.at(-1)!;
  const currentFreeSpace = TOTAL_FILE_SYSTEM_SIZE - rootFolderSize;
  const requiredFreeSpace = Math.abs(MINIMUM_REQUIRED_SIZE - currentFreeSpace);

  const largeEnoughFolders = directorySizes.filter(
    (size) => size > requiredFreeSpace,
  );
  const smallestFolder = Math.min(...largeEnoughFolders);

  logAnswer(2, smallestFolder);
};

export default async function () {
  runOne();
  runTwo();
}
