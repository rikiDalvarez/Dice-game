import { Dice } from "./Dice";
export class Game {
  readonly gameWin: boolean;
  readonly dice1Value: number;
  readonly dice2Value: number;

  constructor(diceRoller: Dice) {
    this.dice1Value = diceRoller.roll();
    this.dice2Value = diceRoller.roll();
    this.gameWin = this.hasWon();
  }

  private hasWon(): boolean {
    return this.dice1Value + this.dice2Value === 7;
  }
}
