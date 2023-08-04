import { Game } from "./Game";
import { User } from "./User";

export class Player extends User {
  public id: string | undefined;
  readonly succesRate: number;
  public games: Array<Game>;
  constructor(
    email: string,
    password: string,
    games: Array<Game>,
    name: string,
   id?:string
  ) {
    super(email, password, name);
    this.games = games;
    this.id = id;
    this.succesRate = this.calcSuccesRate();
  }

  public newGame(game: Game) {
    this.games.push(game);
  }

  public deleteGames() {
    this.games = [];
  }

  private calcSuccesRate() {
    const wins = this.games.filter((game) => game.gameWin).length;
    return this.games.length >0 ?(wins / this.games.length) * 100: 0
  }
  
   public setId(id: string) {
   this.id = id
   }

  public getGames() {
    return this.games;
  }
}

