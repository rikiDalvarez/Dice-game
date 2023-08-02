export class DiceRoller {
    public roll():number {
      return Math.ceil(Math.random() * 6)
    }
  }