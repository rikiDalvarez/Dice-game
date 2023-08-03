import { describe, test } from "@jest/globals";
import { Player } from "../src/Player";
import { Game } from "../src/Game";
import { DiceRoller } from "../src/DiceRoller";
import { mocked } from "jest-mock";
jest.mock("../src/DiceRoller");
describe("Player class test", () => {
  const diceRoller = new DiceRoller();
  const mockedDiceRoller = mocked(diceRoller);
  function gameGenerator(firstDice: number, secondDice: number): Game {
    mockedDiceRoller.roll
      .mockReturnValueOnce(firstDice)
      .mockReturnValueOnce(secondDice);
    return new Game(mockedDiceRoller);
  }

  test("calcSuccesRate should return percent of won games", () => {
    const wonGame = gameGenerator(3, 4);
    const lostGame = gameGenerator(1, 2);

    const player1 = new Player("name", "password", [wonGame, lostGame]);
    expect(player1.calcSuccesRate()).toEqual(50.0);
    const player2 = new Player("name", "password", [
      wonGame,
      wonGame,
      wonGame,
      lostGame,
    ]);
    expect(player2.calcSuccesRate()).toEqual(75.0);
  });
});
