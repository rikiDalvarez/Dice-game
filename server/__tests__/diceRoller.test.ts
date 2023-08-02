import { describe, test } from "@jest/globals";
import { DiceRoller } from "../src/DiceRoller";
describe("DiceRoller class test", () => {
  test("DiceRoller should return values between 1 and 6", () => {
    const diceRoller = new DiceRoller();
    for (let i = 0; i < 100; i++) {
      const result = diceRoller.roll();
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(6);
    }
  });
  
});