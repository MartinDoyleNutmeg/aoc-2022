import { logAnswer } from '../../../utils';

import { parseInput } from './helpers';

// const data = parseInput({ test: false });
parseInput({ test: true });

const runOne = () => {
  logAnswer(1, 'foo');
};

const runTwo = () => {
  logAnswer(2, 'bar');
};

export default async function () {
  runOne();
  runTwo();
}
