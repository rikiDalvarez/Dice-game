import { describe, test } from "@jest/globals";
import { Game } from "../src/Game";
import { DiceRoller } from "../src/DiceRoller";
import { mocked } from "jest-mock";
jest.mock("../src/DiceRoller");
describe("Game  class test", () => {
  test("Game is won if sum of dices is 7", () => {
    const diceRoller = new DiceRoller();
    const mockedDiceRoller = mocked(diceRoller);
    mockedDiceRoller.roll.mockReturnValueOnce(3).mockReturnValueOnce(4);
    const game = new Game(mockedDiceRoller);
    expect(game.gameWin).toBeTruthy();
  });

  test("Game is lost if sum of dices is not 7", () => {
    const diceRoller = new DiceRoller();
    const mockedDiceRoller = mocked(diceRoller);
    mockedDiceRoller.roll.mockReturnValueOnce(1).mockReturnValueOnce(4);
    const game = new Game(mockedDiceRoller);
    expect(game.gameWin).toBeFalsy();
  });
});
