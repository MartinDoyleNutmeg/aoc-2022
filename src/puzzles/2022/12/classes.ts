export class Position {
  public static GRID: number[][];

  public static START_COORDS: [number, number];

  public static END_COORDS: [number, number];

  public static END_POS: Position;

  public static START_POS: Position;

  public static isPartOne: boolean;

  public readonly row: number;

  public readonly col: number;

  public readonly height: number;

  public readonly isValid: boolean;

  public constructor(row: number, col: number) {
    this.row = row;
    this.col = col;

    if (row < 0 || row >= Position.GRID.length || col < 0 || col >= Position.GRID[0]!.length) {
      this.isValid = false;
      this.height = 0;
    } else {
      this.isValid = true;
      this.height = Position.GRID[row]![col]!;
    }
  }

  public static init() {
    const [START_ROW, START_COL] = Position.START_COORDS;
    const [END_ROW, END_COL] = Position.END_COORDS;
    Position.START_POS = new Position(START_ROW, START_COL);
    Position.END_POS = new Position(END_ROW, END_COL);
  }

  public get isFinished() {
    return Position.isPartOne
      ? this.height === 25 && this.coords === Position.END_POS.coords
      : this.height === 0;
  }

  public get coords() {
    return `${this.row},${this.col}`;
  }

  public toString() {
    const value = String.fromCharCode(this.height + 97);
    return `${this.row},${this.col}=${this.height}(${value})`;
  }
}
