import { Game } from "./Game";
import { Dice } from "./Dice";
import { User } from "./User";

const diceRoller = new Dice();

export class Player extends User {
  private id: object | undefined;
  readonly succesRate: number;
  private games: Array<Game>;
  constructor(
   
    email: string,
    password: string,
    games: Array<Game>,
    name: string,
  
  ) {
    super(email, password, name);
    this.games = games;
    //this.id = id;
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
    return (wins / this.games.length) * 100;
  }
  
  // setId(id: object) {
  // this._id = id
  // }

  public getGames() {
    return this.games;
  }
}

///const game1 = new Game(diceRoller);
///const game2 = new Game(diceRoller);
//const game3 = new Game(diceRoller);

//const player1 = new Player("1@1.com","test", "test", [game1, game2, game3]);

//player1.newGame(new Game(diceRoller));
//player1.newGame(new Game(diceRoller));

//console.log(player1.getGames());
