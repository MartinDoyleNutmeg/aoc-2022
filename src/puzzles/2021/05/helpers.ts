/* eslint-disable canonical/id-match */

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

interface ParseInputArgs {
  test: boolean;
}

type InputData = VentLine[];

const ENABLE_LOGGING = false;
const HERE = path.dirname(import.meta.url).slice('file:'.length);
const LINE_REGEX = /^(\d+),(\d+) -> (\d+),(\d+)$/u;

const log = (...args: any[]) => {
  if (ENABLE_LOGGING) {
    console.log(...args);
  }
};

export class Point {
  public readonly x: number;

  public readonly y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toString() {
    return `${this.x},${this.y}`;
  }
}

export class VentLine {
  public readonly start: Point;

  public readonly end: Point;

  private _points: Point[] = [];

  public getPoints(includeDiagonals: boolean): Point[] {
    if (this.isDiagonal) {
      return includeDiagonals ? this._points : [];
    }

    return this._points;
  }

  public get isDiagonal() {
    return this.start.x !== this.end.x && this.start.y !== this.end.y;
  }

  public constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
    this.generatePoints();
    log(this.toString());
    log('');
  }

  private generatePoints() {
    if (this.start.x === this.end.x) {
      const y1 = Math.min(this.start.y, this.end.y);
      const y2 = Math.max(this.start.y, this.end.y);
      for (let nextY = y1; nextY <= y2; nextY++) {
        this._points.push(new Point(this.start.x, nextY));
      }
    } else if (this.start.y === this.end.y) {
      const x1 = Math.min(this.start.x, this.end.x);
      const x2 = Math.max(this.start.x, this.end.x);
      for (let nextX = x1; nextX <= x2; nextX++) {
        this._points.push(new Point(nextX, this.start.y));
      }
    } else {
      const leftPoint = this.start.x < this.end.x ? this.start : this.end;
      const rightPoint = this.start.x > this.end.x ? this.start : this.end;
      if (leftPoint.y < rightPoint.y) {
        // direction is down and to the right
        for (
          let nextX = leftPoint.x, nextY = leftPoint.y;
          nextX <= rightPoint.x;
          nextX++, nextY++
        ) {
          this._points.push(new Point(nextX, nextY));
        }
      } else {
        // direction is up and to the right
        for (
          let nextX = leftPoint.x, nextY = leftPoint.y;
          nextX <= rightPoint.x;
          nextX++, nextY--
        ) {
          this._points.push(new Point(nextX, nextY));
        }
      }
    }
  }

  public toString() {
    const allPoints = this._points
      .map((nextPoint) => {
        return nextPoint.toString();
      })
      .join(', ');

    return `Line from ${this.start.x},${this.start.y} to ${this.end.x},${
      this.end.y
    }${this.isDiagonal ? ' (diagonal)' : ''}
${chalk.cyan.bold(`All points:`)} ${allPoints}`;
  }
}

export const parseInput = ({ test }: ParseInputArgs): InputData => {
  // Read input from disk
  const filename = test ? 'test-input.txt' : 'input.txt';
  const filepath = path.join(HERE, filename);
  // eslint-disable-next-line node/no-sync
  const input = fs.readFileSync(filepath, 'utf8');

  // Clean input
  const lines = input
    .split('\n')
    .map((nextLine) => {
      return nextLine.trim();
    })
    .filter((nextLine) => {
      return nextLine.length > 0;
    });

  // Generate lines
  const ventLines = lines.map((nextLine) => {
    const [, x1, y1, x2, y2] = LINE_REGEX.exec(nextLine)!;
    const ventLine = new VentLine(
      new Point(Number.parseInt(x1!, 10), Number.parseInt(y1!, 10)),
      new Point(Number.parseInt(x2!, 10), Number.parseInt(y2!, 10)),
    );
    return ventLine;
  });

  return ventLines;
};
