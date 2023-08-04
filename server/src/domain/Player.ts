import { Game } from "./Game";
import { Dice } from "./Dice";

const diceRoller = new Dice();


export class Player {
  readonly id: string
  readonly email: string;
  readonly name?: string;
  readonly password: string;
  readonly registrationDate: Date;
  readonly succesRate:number;
  private games: Array<Game>;

  constructor(
    email: string,
   name: string = "unknown",
    password: string,
    games: Array<Game>,
    id?:string
  ) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.games = games;
    this.registrationDate = new Date();
    this.id = id
    this.succesRate = this.calcSuccesRate()
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
  //setId(id: string) {
   // this.id = id
  //}

  public getGames(){
    return this.games
  }
}

const game1 = new Game(diceRoller);
const game2 = new Game(diceRoller);
const game3 = new Game(diceRoller);

const player1 = new Player("1@1.com","test", "test", [game1, game2, game3]);

player1.newGame(new Game(diceRoller));
player1.newGame(new Game(diceRoller));

console.log(player1.getGames());
