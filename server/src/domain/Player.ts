import { Game } from "./Game";
import { User } from "./User";

export type GameType = {
  id: string;
  gameWin: boolean;
  dice1Value: number;
  dice2Value: number;
  player_id?: string
};

export type MongoPlayerType = {
  _id: string;
  successRate: number;
  games: Array<GameType>;
  email: string;
  name: string | null;
  password: string;
  registrationDate: Date
};

export interface IPlayerSQL {
  id?: string;
  name: string | null;
  email: string;
  password: string;
  registrationDate: Date;
  successRate: number;
}


export class Player extends User {
  readonly id: string;
  private _successRate: number;
  private _games: Array<GameType>;
  constructor(
    email: string,
    password: string,
    games: Array<GameType>,
    name: string | null,
    id: string
  ) {
    super(email, password, name);
    this._games = games;
    this.id = id;
    this._successRate = this.calcSuccesRate();
  }
  
  public addNewGame(game: Game) {
    this._games.push(game);
    this._successRate = this.calcSuccesRate();
  }

  public deleteGames() {
    this._games = [];
    this._successRate = this.calcSuccesRate();
  }

  private calcSuccesRate() {
    const wins = this._games.filter((game) => game.gameWin).length;
    return this._games.length > 0
      ? Number(((wins / this._games.length) * 100).toFixed(2))
      : 0;
  }

  public get successRate() {
    return this._successRate;
  }

  public get games() {
    return this._games;
  }
}
