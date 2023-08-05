import { describe, test } from "@jest/globals";
import { Player } from "../src/domain/Player";
import { Game } from "../src/domain/Game";
import { Dice } from "../src/domain/Dice";
import { mocked } from "jest-mock";

jest.mock("../src/domain/Dice");
describe("Player class test", () => {
  const diceRoller = new Dice();
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

    const player1 = new Player("1@1.com", "password", [wonGame, lostGame], "name",);
    expect(player1.successRate).toEqual(50.0);
    const player2 = new Player("1@1.com","password", [
      wonGame,
      wonGame,
      wonGame,
      lostGame,
    ],"name");
    expect(player2.successRate).toEqual(75.0);
  });
});
