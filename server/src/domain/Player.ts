import { Game } from "./Game";
import { User } from "./User";

type GameType = {
  gameWin: boolean;
  dice1Value: number;
  dice2Value: number;
};

export class Player extends User {
  public id: string | undefined;
  public successRate: number;

  public games: Array<GameType>;
  constructor(
    email: string,
    password: string,
    games: Array<GameType>,
    name: string,
    id?: string
  ) {
    super(email, password, name);
    this.games = games;
    this.id = id;
    this.successRate = this.calcSuccesRate();
  }

  public addNewGame(game: Game) {
    this.games.push(game);
    this.successRate = this.calcSuccesRate();
  }
  public getSuccesRate(): number {
    return this.successRate;
  }
  public deleteGames() {
    this.games = [];
    this.successRate = this.calcSuccesRate();
  }

  private calcSuccesRate() {
    const wins = this.games.filter((game) => game.gameWin).length;
    return this.games.length > 0
      ? Number(((wins / this.games.length) * 100).toFixed(2))
      : 0;
  }

  //public setId(id: string) {
  // this.id = id;
  //}

  public getGames() {
    return this.games;
  }
}
