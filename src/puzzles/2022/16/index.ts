import { logAnswer, readData } from '../../../utils';

const USE_TEST_DATA = true;
const DATA = readData({
  importUrl: import.meta.url,
  useTestData: USE_TEST_DATA,
})
  .map((nextLine) => nextLine.trim()) // Remove whitespace on each line
  .slice(0, -1) // Remove last line as it will always be blank
  .filter((nextLine) => Boolean(nextLine)); // Remove any blank lines

// console.log({ DATA });

const LINE_REGEX =
  /^Valve (?<name>[A-Z]{2}) has flow rate=(?<flowRate>\d+); tunnels? leads? to valves? (?<connectedValves>[A-Z, ]+)$/u;

class Valve {
  public readonly name: string;

  public flowRate?: number;

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

const runOne = () => {
  // Construct graph
  const valvesGraph = new Map<string, Valve>();
  for (const nextLine of DATA) {
    // Parse next line
    const match = LINE_REGEX.exec(nextLine);
    if (!match) {
      throw new Error(`Unable to parse line: ${nextLine}`);
    }
    const { name, flowRate, connectedValves } = match.groups!;
    // console.log({ connectedValves, flowRate, name });

    // Create new valve and connect to real or placeholder valves
    let nextValve = valvesGraph.get(name!);
    if (!nextValve) {
      nextValve = new Valve(name!);
    }
    valvesGraph.set(name!, nextValve);
    nextValve.flowRate = Number.parseInt(flowRate!, 10);
    for (const nextValveName of connectedValves!.split(', ')) {
      let nextConnectedValve = valvesGraph.get(nextValveName);
      if (!nextConnectedValve) {
        nextConnectedValve = new Valve(nextValveName);
        valvesGraph.set(nextValveName, nextConnectedValve);
      }
      nextValve.connectTo(nextConnectedValve);
    }
  }

  // Start DFS search to find highest flow
  const startingNode = valvesGraph.get('AA')!;
  console.log(startingNode);

  logAnswer(1, undefined);
};

const runTwo = () => {
  logAnswer(2, undefined);
};

export default async function () {
  runOne();
  runTwo();
}
