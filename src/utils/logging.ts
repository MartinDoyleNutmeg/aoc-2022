import chalk from 'chalk';

import { NUMBER_FORMATTER, MILLISECOND_FORMATTER } from './formatters';

type PartNumber = 1 | 2;

export const logPuzzleDay = (year: string, day: string) => {
  console.info(
    chalk.bold.green(`
[${year}] Day ${day}`),
  );
};

export const logAnswer = (part: PartNumber, answer: unknown) => {
  const partText = `Part ${part}`;
  let answerText: string;
  if (typeof answer === 'number') {
    const formatted = NUMBER_FORMATTER.format(answer);
    const raw = `${answer}`;
    answerText = `Answer is ${formatted}`;
    if (formatted !== raw) {
      answerText += ` (${raw})`;
    }
  } else {
    answerText = `Answer is ${answer}`;
  }

  const messageParts = [chalk.bold.cyan(partText), '➡️ ', chalk.bold.yellow(answerText)];
  console.info(messageParts.join(' '));
};

export const logTime = (before: number) => {
  const timeTaken = MILLISECOND_FORMATTER.format(performance.now() - before);
  console.info(chalk.green(`Runtime: ${timeTaken}ms`));
};

export const logComplete = (before: number) => {
  const timeTaken = MILLISECOND_FORMATTER.format(performance.now() - before);
  const completedMessage = ` Completed in ${timeTaken}ms`;
  const numEquals = completedMessage.length + 1;
  const equalsLine = Array.from({ length: numEquals }).fill('=').join('');
  const message = `

${equalsLine}
${completedMessage}
${equalsLine}

`;
  console.info(message);
};

export const logStart = () => {
  console.info(`
========================
 Starting puzzle run...
========================
`);
};

export const logError = (label: string, error: Error) => {
  console.info(chalk.bold.red(label), error);
};

export const logInfo = (...args: any[]) => {
  console.info(...args);
};
