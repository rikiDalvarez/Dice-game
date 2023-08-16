import { describe, test } from "@jest/globals";
import { Game } from "../../src/domain/Game";
import { Dice } from "../../src/domain/Dice";
import { mocked } from "jest-mock";
jest.mock("../../src/domain/Dice");
describe("Game  class test", () => {
  test("Game is won if sum of dices is 7", () => {
    const diceRoller = new Dice();
    const mockedDiceRoller = mocked(diceRoller);
    mockedDiceRoller.roll.mockReturnValueOnce(3).mockReturnValueOnce(4);
    const game = new Game(mockedDiceRoller);
    expect(game.gameWin).toBeTruthy();
  });

  test("Game is lost if sum of dices is not 7", () => {
    const diceRoller = new Dice();
    const mockedDiceRoller = mocked(diceRoller);
    mockedDiceRoller.roll.mockReturnValueOnce(1).mockReturnValueOnce(4);
    const game = new Game(mockedDiceRoller);
    expect(game.gameWin).toBeFalsy();
  });
});
