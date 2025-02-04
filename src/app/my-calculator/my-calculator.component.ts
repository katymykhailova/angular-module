import { Component } from '@angular/core';

interface CalcGroups {
  first: CalcVar;
  second: CalcVar;
  operation: CalcOperations;
}
interface CalcVar {
  value: number;
  modificator: CalcModifiers;
}
enum CalcOperations {
  plus = '+',
  minus = '-',
  multiplay = '*',
  divide = '/',
}
enum CalcModifiers {
  none = 'none',
  sin = 'sin',
  cos = 'cos',
  square = 'square',
}

@Component({
  selector: 'app-my-calculator',
  standalone: false,

  templateUrl: './my-calculator.component.html',
  styleUrl: './my-calculator.component.scss',
})
export class MyCalculatorComponent {
  // public first: number = 1;
  // public second: number = 1;
  // public operation: string = '+';
  // public operations: string[] = ['-', '+', '*', '/'];
  // public result: number | undefined = undefined;
  public calcOperations = CalcOperations;
  public calcModifiers = CalcModifiers;
  public calcGroups: CalcGroups[] = [
    {
      first: { value: 5, modificator: this.calcModifiers.none },
      second: { value: 5, modificator: this.calcModifiers.none },
      operation: this.calcOperations.plus,
    },
  ];
  public history: string[] = [];
  public result?: number;
  public operationsBetweenGroups: CalcOperations[] = [];
  public addGroup(): void {
    this.calcGroups.push({
      first: { value: 0, modificator: this.calcModifiers.none },
      second: { value: 0, modificator: this.calcModifiers.none },
      operation: this.calcOperations.plus,
    });
    this.operationsBetweenGroups.push(this.calcOperations.plus);
  }
  public removeGroup(index: number): void {
    this.calcGroups.splice(index, 1);
  }

  public calcGroup() {
    let result = 0;
    let tempHistory: string[] = [];
    this.calcGroups.forEach((group, i) => {
      if (i === 0) {
        result = this.calc(
          this.calcValueWithModif(group.first),
          this.calcValueWithModif(group.second),
          group.operation,
        );
      } else {
        let tempResult = this.calc(
          this.calcValueWithModif(group.first),
          this.calcValueWithModif(group.second),
          group.operation,
        );
        result = this.calc(result, tempResult, this.operationsBetweenGroups[i - 1]);
      }
      tempHistory.push(
        `(
          ${group.first.modificator != this.calcModifiers.none ? group.first.modificator : ''} ${group.first.value}
          ${group.operation}
          ${group.second.modificator != this.calcModifiers.none ? group.second.modificator : ''} ${group.second.value}

          )`,
      );
    });
    tempHistory.push(`= ${result}`);
    this.history.push(tempHistory.join(' '));
    this.result = result;
  }
  public calcValueWithModif(value: CalcVar): number {
    switch (value.modificator) {
      case CalcModifiers.none:
        return value.value;
      case CalcModifiers.cos:
        return Math.cos(value.value);
      case CalcModifiers.sin:
        return Math.sin(value.value);
      case CalcModifiers.square:
        return Math.pow(value.value, 2);
    }
  }

  public calc(first: number, second: number, operation: CalcOperations): number {
    switch (operation) {
      case this.calcOperations.plus:
        return first + second;
      case this.calcOperations.minus:
        return first - second;
      case this.calcOperations.multiplay:
        return first * second;
      case this.calcOperations.divide:
        return first / second;
    }
  }
}
