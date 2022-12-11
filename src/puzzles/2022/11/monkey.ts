interface Params {
  items: number[];
  monkeyIdx: number;
  operation: Operation;
  testDivisor: number;
  throwRecipients: [number, number];
  worryReductionFactor: number;
}

type Operator = '*' | '**' | '+';

export class Operation {
  private readonly operator: Operator;

  private readonly operand: number;

  public constructor(operator: Operator, operand: number) {
    this.operator = operator;
    this.operand = operand;
  }

  public perform(input: number) {
    if (this.operator === '*') {
      return input * this.operand;
    }
    if (this.operator === '**') {
      return input ** this.operand;
    }
    if (this.operator === '+') {
      return input + this.operand;
    }
    throw new Error(`Unknown operator ${this.operator}`);
  }
}

export class Monkey {
  private readonly monkeyIdx: number;

  private readonly items: number[];

  private readonly operation: Operation;

  private readonly worryReductionFactor: number;

  private readonly testDivisor: number;

  private readonly throwRecipients: [number, number];

  private inspectCounter: number;

  public constructor({
    items,
    monkeyIdx,
    operation,
    testDivisor,
    throwRecipients,
    worryReductionFactor,
  }: Params) {
    this.items = items;
    this.monkeyIdx = monkeyIdx;
    this.operation = operation;
    this.testDivisor = testDivisor;
    this.throwRecipients = throwRecipients;
    this.worryReductionFactor = worryReductionFactor;
    this.inspectCounter = 0;
  }

  public catchItem(item: number) {
    this.items.push(item);
  }

  public inspectAndThrow(modulo: number): number[][] {
    const monkeysAndItems: number[][] = [];

    let nextItem;
    while ((nextItem = this.items.shift()) !== undefined) {
      // Inspect item
      nextItem = this.operation.perform(nextItem % modulo);
      if (nextItem === Number.POSITIVE_INFINITY) {
        throw new Error(
          `Infinity detected on monkey ${this.monkeyIdx} during inspection ${this.inspectCounter}`,
        );
      }
      this.inspectCounter++;

      // Post-inspection worry reduction
      nextItem = Math.floor(nextItem / this.worryReductionFactor);

      // Test item and assign recipient
      let recipientIdx;
      if (nextItem % this.testDivisor === 0) {
        recipientIdx = this.throwRecipients[0];
      } else {
        recipientIdx = this.throwRecipients[1];
      }

      // Assign item to recipient
      monkeysAndItems[recipientIdx] = monkeysAndItems[recipientIdx] ?? [];
      monkeysAndItems[recipientIdx]!.push(nextItem);
    }

    return monkeysAndItems;
  }

  public get inspections() {
    return this.inspectCounter;
  }

  public toString() {
    return `Monkey(${this.inspectCounter} inspections=${this.items.join(',')})`;
  }
}
