import { Dice } from "./Dice";
import { v4 } from 'uuid';


export class Game {
  readonly id:string;
  readonly gameWin: boolean;
  readonly dice1Value: number;
  readonly dice2Value: number;

  constructor(diceRoller: Dice) {
    this.dice1Value = diceRoller.roll();
    this.dice2Value = diceRoller.roll();
    this.gameWin = this.hasWon();
    this.id = this.generateId()
  }

  private hasWon(): boolean {
    return this.dice1Value + this.dice2Value === 7;
  }

  generateId(): string {
    return v4()
  }

}
