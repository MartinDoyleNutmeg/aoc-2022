import { logAnswer, readData } from '../../../utils';

type PacketData = (PacketData | number)[] | number;

type Comparison = -1 | 0 | 1;

const DATA = readData({
  importUrl: import.meta.url,
  useTestData: false,
})
  .map((nextLine) => nextLine.trim())
  .filter((nextLine) => Boolean(nextLine));

// console.log({ DATA });

// eslint-disable-next-line no-eval
const PARSED = DATA.map((nextLine) => eval(nextLine));

const comparePackets = (packetOne: PacketData, packetTwo: PacketData): Comparison => {
  let comparison: Comparison = 0;
  let firstPacket = packetOne;
  let secondPacket = packetTwo;
  if (typeof firstPacket === 'number' && Array.isArray(secondPacket)) {
    firstPacket = [firstPacket];
  } else if (typeof secondPacket === 'number' && Array.isArray(firstPacket)) {
    secondPacket = [secondPacket];
  }

  if (typeof firstPacket === 'number' && typeof secondPacket === 'number') {
    if (firstPacket < secondPacket) {
      comparison = -1;
    } else if (firstPacket > secondPacket) {
      comparison = 1;
    }
  } else if (Array.isArray(firstPacket) && Array.isArray(secondPacket)) {
    for (
      let packetIdx = 0;
      packetIdx < Math.min(firstPacket.length, secondPacket.length);
      packetIdx++
    ) {
      if (comparison !== 0) {
        break;
      }
      const firstPacketItem = firstPacket[packetIdx]!;
      const secondPacketItem = secondPacket[packetIdx]!;
      comparison = comparePackets(firstPacketItem, secondPacketItem);
    }
    if (comparison === 0) {
      // Finished looping, but still no answer - compare lengths
      if (firstPacket.length < secondPacket.length) {
        comparison = -1;
      } else if (firstPacket.length > secondPacket.length) {
        comparison = 1;
      }
    }
  } else {
    throw new TypeError(
      `Unexpected type found, comparing ${JSON.stringify(firstPacket)} and ${JSON.stringify(
        secondPacket,
      )}`,
    );
  }
  return comparison;
};

const runOne = () => {
  const correctlyOrderedPairs: number[] = [];
  for (let packetIdx = 0; packetIdx < PARSED.length; packetIdx += 2) {
    let correctlyOrdered: boolean;
    const firstPacket = PARSED[packetIdx] as PacketData;
    const secondPacket = PARSED[packetIdx + 1] as PacketData;
    const comparison = comparePackets(firstPacket, secondPacket);
    if (comparison === -1) {
      correctlyOrdered = true;
    } else if (comparison === 1) {
      correctlyOrdered = false;
    } else {
      throw new SyntaxError(
        `Unexpectedly equal comparison: "${firstPacket}" and "${secondPacket}"`,
      );
    }
    if (correctlyOrdered) {
      correctlyOrderedPairs.push(packetIdx / 2 + 1);
    }
  }

  const correctPairsSum = correctlyOrderedPairs.reduce((acc, next) => acc + next, 0);

  logAnswer(1, correctPairsSum);
};

const runTwo = () => {
  const sorted = [...PARSED, [[2]], [[6]]].sort(comparePackets);
  const firstDividerIdx =
    sorted.findIndex((nextPacket) => JSON.stringify(nextPacket) === '[[2]]') + 1;
  const secondDividerIdx =
    sorted.findIndex((nextPacket) => JSON.stringify(nextPacket) === '[[6]]') + 1;
  logAnswer(2, firstDividerIdx * secondDividerIdx);
};

export default async function () {
  runOne();
  runTwo();
}
