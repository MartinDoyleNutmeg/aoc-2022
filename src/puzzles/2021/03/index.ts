/* eslint-disable canonical/id-match */
import { logAnswer } from '../../../utils';

import untypedData from './data.json';
// import untypedData from './test-data.json';

const data: string[] = untypedData;

const calculateGammaAndEpsilon = () => {
  const totals: number[] = [];
  for (const nextBinaryNum of data) {
    // eslint-disable-next-line unicorn/no-for-loop
    for (let bitIndex = 0; bitIndex < nextBinaryNum.length; bitIndex++) {
      if (totals[bitIndex] === undefined) {
        totals[bitIndex] = 0;
      }

      totals[bitIndex] += nextBinaryNum.charAt(bitIndex) === '1' ? 1 : 0;
    }
  }

  const gammaStr = totals
    .map((nextTotal) => {
      return data.length / nextTotal <= 2 ? '1' : '0';
    })
    .join('');
  const epsilonStr = gammaStr
    .split('')
    .map((nextBit) => {
      return nextBit === '0' ? '1' : '0';
    })
    .join('');

  const gamma = Number.parseInt(gammaStr, 2);
  const epsilon = Number.parseInt(epsilonStr, 2);

  return { epsilon, epsilonStr, gamma, gammaStr };
};

const calculateOxygenCO2Ratings = () => {
  const { epsilonStr, gammaStr } = calculateGammaAndEpsilon();

  let nextOxygenBitFilter = gammaStr.charAt(0);
  let nextOxygenBit = 0;
  let filteredData = data;
  let oxygenRating: number | undefined;
  while (oxygenRating === undefined) {
    let nextBitTotal = 0;
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    filteredData = filteredData.filter((nextEntry) => {
      const isValid = nextEntry.charAt(nextOxygenBit) === nextOxygenBitFilter;
      if (isValid) {
        nextBitTotal += Number.parseInt(
          nextEntry.charAt(nextOxygenBit + 1),
          10,
        );
      }

      return isValid;
    });
    if (filteredData.length === 1) {
      oxygenRating = Number.parseInt(filteredData[0]!, 2);
      break;
    }

    nextOxygenBit++;
    nextOxygenBitFilter = filteredData.length / nextBitTotal <= 2 ? '1' : '0';
  }

  let nextCO2BitFilter = epsilonStr.charAt(0);
  let nextCO2Bit = 0;
  filteredData = data;
  let co2Rating: number | undefined;
  while (co2Rating === undefined) {
    let nextBitTotal = 0;
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    filteredData = filteredData.filter((nextEntry) => {
      const isValid = nextEntry.charAt(nextCO2Bit) === nextCO2BitFilter;
      if (isValid) {
        nextBitTotal += Number.parseInt(nextEntry.charAt(nextCO2Bit + 1), 10);
      }

      return isValid;
    });
    if (filteredData.length === 1) {
      co2Rating = Number.parseInt(filteredData[0]!, 2);
      break;
    }

    nextCO2Bit++;
    nextCO2BitFilter = filteredData.length / nextBitTotal > 2 ? '1' : '0';
  }

  return {
    co2Rating,
    oxygenRating,
  };
};

const runOne = () => {
  const { epsilon, gamma } = calculateGammaAndEpsilon();
  const powerConsumption = gamma * epsilon;

  logAnswer(1, powerConsumption);
};

const runTwo = () => {
  const { oxygenRating, co2Rating } = calculateOxygenCO2Ratings();
  const lifeSupport = oxygenRating * co2Rating;

  logAnswer(2, lifeSupport);
};

export default async function () {
  runOne();
  runTwo();
}
