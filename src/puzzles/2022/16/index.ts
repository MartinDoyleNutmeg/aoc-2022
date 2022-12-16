import { logAnswer, readData } from '../../../utils';

type MoveToAndOpenValveFn = (params: {
  flow: number;
  minute: number;
  path: string[];
  totalReleased: number;
  valve: Valve;
}) => void;

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
const MAX_RECENT_VALVES = 1;

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

    // Get/create next valve
    let nextValve = valvesGraph.get(name!);
    if (!nextValve) {
      nextValve = new Valve(name!);
      valvesGraph.set(name!, nextValve);
    }
    nextValve.flowRate = Number.parseInt(flowRate!, 10);

    // Connect to real or placeholder valves
    for (const nextValveName of connectedValves!.split(', ')) {
      let nextConnectedValve = valvesGraph.get(nextValveName);
      if (!nextConnectedValve) {
        nextConnectedValve = new Valve(nextValveName);
        valvesGraph.set(nextValveName, nextConnectedValve);
      }
      nextValve.connectTo(nextConnectedValve);
    }
  }

  // console.log({ valvesGraph });

  // Define recursive function for DFS
  const MAX_TIME = 30;
  const openValves: Valve[] = [];
  let maxReleased = 0;
  const moveToValve: MoveToAndOpenValveFn = ({ flow, minute, totalReleased, valve, path }) => {
    // console.log(path.join('->') + '\n');

    // Setup running counters
    let thisFlow = flow;
    let thisTotalReleased = totalReleased;
    let thisMinute = minute;

    // Take one minute to get here: add minute and update total released.
    thisMinute += 1;
    thisTotalReleased += thisFlow;

    //     console.log(`== Minute ${thisMinute} ==
    // ${
    //   openValves.length === 0
    //     ? 'No valves are open.'
    //     : openValves.length === 1
    //     ? `Valve ${openValves[0]!.name} is open, releasing ${thisFlow} pressure.`
    //     : `Valves ${openValves
    //         .map((nextValve) => nextValve.name)
    //         .join(', ')} are open, releasing ${thisFlow} pressure.`
    // }`);

    // If finished, store max and exit
    if (thisMinute === MAX_TIME) {
      if (thisTotalReleased > maxReleased) {
        console.log(`New max of ${thisTotalReleased} at ${path.join('->')}`);
      }
      // console.log({ maxReleased, path: path.join('->') });
      maxReleased = Math.max(maxReleased, thisTotalReleased);
      return;
    }

    // openValveIfPossible({
    //   flow: thisFlow,
    //   minute: thisMinute,
    //   path: [...path, valve.name],
    //   totalReleased: thisTotalReleased,
    //   valve,
    // });

    // Potentially open valve
    let didOpen = false;
    if (!openValves.includes(valve) && valve.flowRate! > 0) {
      // Will take a minute to open
      thisMinute += 1;
      thisTotalReleased += thisFlow;

      // console.log(`You open valve ${valve.name}.`);

      // Open valve
      openValves.push(valve);
      thisFlow += valve.flowRate!;
      didOpen = true;

      // If finished, store max and exit
      if (thisMinute === MAX_TIME) {
        if (thisTotalReleased > maxReleased) {
          console.log(`New max of ${thisTotalReleased} at ${path.join('->')}`);
        }
        // console.log({ maxReleased, path: path.join('->') });
        maxReleased = Math.max(maxReleased, thisTotalReleased);
        return;
      }
    }

    // Continue to next valves
    for (const nextValve of valve.connectedValves.filter((nextConnectedValve) => {
      // Don't go back to valves unless we've opened a valve this time
      // console.log({ lastValves: path.slice(-MAX_RECENT_VALVES).join('->'), path: path.join('->') });
      const isTooRecent = path.slice(-MAX_RECENT_VALVES).includes(nextConnectedValve.name);
      const isValid = didOpen || !isTooRecent;
      return isValid;
    })) {
      moveToValve({
        flow: thisFlow,
        minute: thisMinute,
        path: [...path, valve.name],
        totalReleased: thisTotalReleased,
        valve: nextValve,
      });
    }

    // console.log({ currentFlow: flow, minute, totalReleased, valve });
  };

  // Start DFS to find highest flow
  const startingNode = valvesGraph.get('AA')!;
  for (const nextValve of startingNode.connectedValves) {
    moveToValve({
      flow: 0,
      minute: 0,
      path: ['AA'],
      totalReleased: 0,
      valve: nextValve,
    });
  }

  logAnswer(1, maxReleased);
};

const runTwo = () => {
  logAnswer(2, undefined);
};

export default async function () {
  runOne();
  runTwo();
}
