export class Dice {
    public roll():number {
      return Math.ceil(Math.random() * 6)
    }
  }