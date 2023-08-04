import { describe, test } from "@jest/globals";
import { Player } from "../src/domain/Player";
import { Dice } from "../src/domain/Dice";
import { mocked } from "jest-mock";
import { Game } from "../src/domain/Game";
import { Ranking } from "../src/domain/Ranking";

jest.mock("../src/domain/Dice");

describe("Ranking class test", () => {
  const diceRoller = new Dice();
  const mockedDiceRoller = mocked(diceRoller);
  function gameGenerator(firstDice: number, secondDice: number): Game {
    mockedDiceRoller.roll
      .mockReturnValueOnce(firstDice)
      .mockReturnValueOnce(secondDice);
    return new Game(mockedDiceRoller);
  }
  test("meanSuccesRate return 0 for empty array", () => {
    const ranking = new Ranking([]);
    expect(ranking.meanSuccesRate()).toEqual(0);
});

test("meanSuccesRate return mean value", () => {
    const wonGame = gameGenerator(3, 4);
    const lostGame = gameGenerator(1, 2);
    const player1 = new Player("1@1.com", "name", "password", [
      wonGame,
      wonGame,
    ]);
    const player2 = new Player("1@1.com", "name", "password", [
      wonGame,
      lostGame,
    ]);
    const player3 = new Player("1@1.com", "name", "password", [
        lostGame,
        lostGame,
      ]);
  
    const ranking1 = new Ranking([player1, player2]);
    const ranking2 = new Ranking([player1, player2, player3]);
    expect(ranking1.meanSuccesRate()).toBe(75.00);
    expect(ranking2.meanSuccesRate()).toBe(50.00);
});
  
});
