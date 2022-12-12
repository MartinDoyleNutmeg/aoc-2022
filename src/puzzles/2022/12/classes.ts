export class Position {
  public readonly row: number;

  public readonly col: number;

  public readonly height: number;

  public readonly isValid: boolean;

  public constructor(row: number, col: number, grid: number[][]) {
    this.row = row;
    this.col = col;

    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0]!.length) {
      this.isValid = false;
      this.height = 0;
    } else {
      this.isValid = true;
      this.height = grid[row]![col]!;
    }
  }

  public get coords() {
    return `${this.row},${this.col}`;
  }

  public toString() {
    const value = String.fromCharCode(this.height + 97);
    return `${this.row},${this.col}=${this.height}(${value})`;
  }
}
