import { logAnswer, readData } from '../../../utils';

const USE_TEST_DATA = true;
const DATA = readData({
  importUrl: import.meta.url,
  useTestData: USE_TEST_DATA,
})
  .map((nextLine) => nextLine.trim()) // Remove whitespace on each line
  .slice(0, -1) // Remove last line as it will always be blank
  .filter((nextLine) => Boolean(nextLine)); // Remove any blank lines

console.log({ DATA });

const LINE_REGEX =
  /^Valve (?<name>[A-Z]{2}) has flow rate=(?<flowRate>\d+); tunnels? leads? to valves? (?<connectedValves>[A-Z, ]+)$/u;

class Valve {
  public readonly name: string;

  public flowRate?: number;

  public isOpen = false;

  private connectedTo: Valve[] = [];

  public constructor(name: string) {
    this.name = name;
  }

  public get connectedValves(): Valve[] {
    return this.connectedTo;
  }

  public connectTo(valve: Valve): void {
    this.connectedTo.push(valve);
  }
}

const VALVES_MAP = (() => {
  const valvesMap = new Map<string, Valve>();

  // Loop through all lines
  for (const nextLine of DATA) {
    // Parse next line
    const match = LINE_REGEX.exec(nextLine);
    if (!match) {
      throw new Error(`Unable to parse line: ${nextLine}`);
    }
    const { name, flowRate, connectedValves } = match.groups!;

    // Get/create next valve
    let nextValve = valvesMap.get(name!);
    if (!nextValve) {
      nextValve = new Valve(name!);
      valvesMap.set(name!, nextValve);
    }
    nextValve.flowRate = Number.parseInt(flowRate!, 10);

    // Connect to real or placeholder valves
    for (const nextValveName of connectedValves!.split(', ')) {
      let nextConnectedValve = valvesMap.get(nextValveName);
      if (!nextConnectedValve) {
        nextConnectedValve = new Valve(nextValveName);
        valvesMap.set(nextValveName, nextConnectedValve);
      }
      nextValve.connectTo(nextConnectedValve);
    }
  }

  return valvesMap;
})();

const getShortestPath = (valve1: Valve, valve2: Valve): string[] => {
  // const distances = new Map<string, number>();
  // const toVisit: Valve[] = [valve1];
  // while (toVisit.length > 0) {
  //   const nextValve = toVisit.shift()!;
  //   const distance = path.length;
  //   const thisDistance = distances.get(nextValve.coords)!;
  //   if (nextValve.isFinished) {
  //     shortestDistance = thisDistance;
  //     break;
  //   }

  //   for (const nextNeighbour of validNeighbours) {
  //     toVisit.push(nextNeighbour);
  //     distances.set(nextNeighbour.coords, thisDistance + 1);
  //   }
  // }

  const shortestPath = [valve1.name, valve2.name];

  return shortestPath!;
};

const SHORTEST_PATHS = (() => {
  const shortestPaths = new Map<string, string[]>();
  const allValves = [...VALVES_MAP.values()];

  let outerLoopCount = 0;
  let activeLoopCount = 0;
  for (const startValve of allValves) {
    for (const endValve of allValves) {
      outerLoopCount++;
      const pathName = `${startValve.name}->${endValve.name}`;
      // console.log(`Finding shortest path for ${pathName} ...`);

      // Set empty path for self-to-self
      if (startValve === endValve) {
        shortestPaths.set(`${startValve.name}->${endValve.name}`, []);
        continue;
      }

      // If reverse path exists, re-use it
      const reversePathName = `${endValve.name}->${startValve.name}`;
      const reversePath = shortestPaths.get(reversePathName);
      if (reversePath !== undefined) {
        const thisPath = reversePath.slice().reverse();
        shortestPaths.set(pathName, thisPath);
        continue;
      }

      // Perform BFS to find shortest path
      activeLoopCount++;
      const shortestPath = getShortestPath(startValve, endValve);
      shortestPaths.set(`${startValve.name}->${endValve.name}`, shortestPath);
    }
  }

  console.log({ activeLoopCount, outerLoopCount });

  return shortestPaths;
})();

console.log(JSON.stringify(SHORTEST_PATHS));

const runOne = () => {
  logAnswer(1, undefined);
};

const runTwo = () => {
  logAnswer(2, undefined);
};

export default async function () {
  runOne();
  runTwo();
}
