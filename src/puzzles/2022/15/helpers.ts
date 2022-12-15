export type Coords = [number, number];

export interface Bounds {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
}
export class Sensor {
  public readonly coords: Coords;

  public readonly x: number;

  public readonly y: number;

  public readonly beaconDistance: number;

  public constructor({ coords, beaconDistance }: { beaconDistance: number; coords: Coords }) {
    this.coords = coords;
    [this.x, this.y] = coords;
    this.beaconDistance = beaconDistance;
  }

  // From https://stackoverflow.com/a/10717542
  public rangeContains(coords: Coords): boolean {
    const [x, y] = coords;
    const xDist = Math.abs(x - this.x);
    const yDist = Math.abs(y - this.y);

    return xDist / this.beaconDistance + yDist / this.beaconDistance <= 1;
  }

  public get bounds(): Bounds {
    return {
      maxX: this.x + this.beaconDistance,
      maxY: this.y + this.beaconDistance,
      minX: this.x - this.beaconDistance,
      minY: this.y - this.beaconDistance,
    };
  }
}
