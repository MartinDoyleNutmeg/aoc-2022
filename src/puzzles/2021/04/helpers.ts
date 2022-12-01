/* eslint-disable canonical/id-match */

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

interface DataType {
  boards: Board[];
  numbers: number[];
}

type BoardData = [RowData, RowData, RowData, RowData, RowData];
type RowData = [number, number, number, number, number];

interface BoardNumberParams {
  colIndex: number;
  rowIndex: number;
  value: number;
}

const ENABLE_LOGGING = false;
const HERE = path.dirname(import.meta.url).slice('file:'.length);

const log = (...args: any[]) => {
  if (ENABLE_LOGGING) {
    console.log(...args);
  }
};

class BoardNumber {
  private readonly _colIndex: number;

  public get colIndex(): number {
    return this._colIndex;
  }

  private readonly _rowIndex: number;

  public get rowIndex(): number {
    return this._rowIndex;
  }

  private _isMarked = false;

  public get isMarked() {
    return this._isMarked;
  }

  public set isMarked(value) {
    this._isMarked = value;
  }

  private readonly value: number;

  public constructor({ rowIndex, colIndex, value }: BoardNumberParams) {
    this._colIndex = colIndex;
    this._rowIndex = rowIndex;
    this.value = value;
  }

  public toString(): string {
    const strValue = ` ${this.value} `.padStart(4, ' ');
    return this.isMarked ? chalk.green.bold(strValue) : chalk.gray(strValue);
  }
}

export class Board {
  private readonly _boardNum: number;

  public get boardNum(): number {
    return this._boardNum;
  }

  private boardNumbers = new Map<number, BoardNumber>();

  private _rowTotals = [0, 0, 0, 0, 0];

  public get rowTotals() {
    return this._rowTotals;
  }

  private _colTotals = [0, 0, 0, 0, 0];

  public get colTotals() {
    return this._colTotals;
  }

  private lastNumberMarked: number | undefined;

  private _hasWon = false;

  public get hasWon() {
    return this._hasWon;
  }

  public constructor(boardNum: number, boardData: BoardData) {
    this._boardNum = boardNum;
    for (const [rowIndex, boardDatum] of boardData.entries()) {
      const nextRow = boardDatum!;
      for (const [colIndex, element] of nextRow.entries()) {
        const nextNum = element!;
        this.boardNumbers.set(
          nextNum,
          new BoardNumber({
            colIndex,
            rowIndex,
            value: nextNum,
          }),
        );
      }
    }
  }

  public applyNumber(newNumber: number): Boolean {
    if (this.boardNumbers.has(newNumber)) {
      this.lastNumberMarked = newNumber;
      const thisNumber = this.boardNumbers.get(newNumber)!;
      thisNumber.isMarked = true;
      this._rowTotals[thisNumber.rowIndex]++;
      this._colTotals[thisNumber.colIndex]++;

      const rowIsFull = this._rowTotals.includes(5);
      const colIsFull = this._colTotals.includes(5);

      if (rowIsFull || colIsFull) {
        this._hasWon = true;

        log('');
        log(
          chalk.green.bold(
            `Board ${this.boardNum} has won with number ${newNumber}!`,
          ),
        );
        log(chalk.green(`Row totals = ${this.rowTotals}`));
        log(chalk.green(`Col totals = ${this.colTotals}`));
        log('');
        log(this.toString());
        log('');
      }
    }

    return this._hasWon;
  }

  public getBoardScore(): number | undefined {
    if (!this._hasWon) {
      return undefined;
    }

    let unmarkedTotal = 0;
    for (const [nextNumVal, numProps] of this.boardNumbers.entries()) {
      if (!numProps.isMarked) {
        const beforeTotal = unmarkedTotal;
        unmarkedTotal += nextNumVal;
        log(chalk.grey(`${beforeTotal} + ${nextNumVal} = ${unmarkedTotal}`));
      }
    }

    const finalScore = unmarkedTotal * this.lastNumberMarked!;
    log(
      chalk.green.bold(`
Final score = ${unmarkedTotal} x ${this.lastNumberMarked} = ${finalScore}
`),
    );
    return finalScore;
  }

  public reset() {
    this._colTotals = [0, 0, 0, 0, 0];
    this._rowTotals = [0, 0, 0, 0, 0];
    this._hasWon = false;
    this.lastNumberMarked = undefined;
    for (const boardNumber of this.boardNumbers.values()) {
      boardNumber.isMarked = false;
    }
  }

  public toString(): string {
    // const lines = [`${[...this.boardNumbers.keys()].join(',')}`];
    const lines = [];
    let nextLine = '';
    let lastRowIndex = 0;
    for (const nextNumObj of this.boardNumbers.values()) {
      if (nextNumObj.rowIndex !== lastRowIndex) {
        lines.push(nextLine);
        nextLine = '';
      }

      nextLine += nextNumObj.toString();
      lastRowIndex = nextNumObj.rowIndex;
    }

    lines.push(nextLine);
    // lines.push(
    //   `Rows=${this._rowTotals.join(',')} Cols=${this._colTotals.join(',')}`,
    // );

    return lines.join('\n');
  }
}

export const parseInput = ({ test }: { test: boolean }): DataType => {
  // Read input from disk
  const filename = test ? 'test-input.txt' : 'input.txt';
  const filepath = path.join(HERE, filename);
  // eslint-disable-next-line node/no-sync
  const input = fs.readFileSync(filepath, 'utf8');

  // Clean input
  const lines = input
    .split('\n')
    .map((nextLine) => {
      return nextLine.replace(/[^0-9,]+/gu, ' ').trim();
    })
    .filter((nextLine) => {
      return nextLine.length > 0;
    });
  const [callableNumbers, ...boardsRows] = lines;

  // Get callable numbers
  const numbers = callableNumbers!.split(',').map((numStr) => {
    return Number.parseInt(numStr, 10);
  });

  // Get boards
  const boards = [];
  let nextBoardRows = boardsRows.slice(0, 5);
  let boardIdx = 0;
  while (nextBoardRows.length > 0) {
    const nextBoardData = nextBoardRows.map((nextRow) => {
      return nextRow.split(' ').map((numStr) => {
        return Number.parseInt(numStr, 10);
      }) as RowData;
    }) as BoardData;
    const nextBoard = new Board(boardIdx + 1, nextBoardData);
    //     log(`
    // Created board ${boardIdx + 1}
    // ${nextBoard.toString()}
    // `);
    boards.push(nextBoard);
    nextBoardRows = boardsRows.slice(boardIdx * 5, boardIdx * 5 + 5);
    boardIdx++;
  }

  return {
    boards,
    numbers,
  };
};
