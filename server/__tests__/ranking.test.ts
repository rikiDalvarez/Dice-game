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
    const ranking = new Ranking();
    expect(ranking.average).toEqual(0);
  });

  test("meanSuccesRate return mean value", () => {
    const wonGame = gameGenerator(3, 4);
    const lostGame = gameGenerator(1, 2);
    const player1 = new Player(
      "mafalda@gl.com",
      "password",
      [wonGame, wonGame],
      "mafalda",
      "1"
    );
    const player2 = new Player(
      "ricky@dl.com",
      "password",
      [lostGame, lostGame],
      "ricky",
      "2"
    );
    const player3 = new Player(
      "bella@bl.com",
      "password",
      [lostGame, lostGame],
      "bella",
      "3"
    );

    const ranking = new Ranking();
    ranking.rankingList = [player1, player2, player3];
    const averageRate =
      (player1.successRate + player2.successRate + player3.successRate) / 3;
    ranking.average = averageRate;
    ranking.winners = [player1];
    ranking.losers = [player2, player3];
    expect(ranking.rankingList).toStrictEqual([
      { name: "mafalda", successRate: 100 },
      { name: "ricky", successRate: 0 },
      { name: "bella", successRate: 0 },
    ]);
    expect(ranking.average).toBe(averageRate);
    expect(ranking.winners).toStrictEqual([
      { name: "mafalda", successRate: 100 },
    ]);
    expect(ranking.losers).toStrictEqual([
      { name: "ricky", successRate: 0 },
      { name: "bella", successRate: 0 },
    ]);
  });
});
