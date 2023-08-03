import { Game } from "./Game";
import { Dice } from "./Dice";

const diceRoller = new Dice();


export class Player {
  _id: string | undefined;
  email: string;
  name?: string;
  password: string;
  registrationDate: Date;
  games: Array<Game>;

  constructor(
    //    _id: string, NO HAY QUE PONERLO, SE GENERA CON SEQUELIZE Y MONGOOSE
    email: string,
    name: string = "unknown",
    password: string,
    games: Array<Game>,
  ) {
    //    this._id = _id; NO HAY QUE PONERLO, SE GENERA CON SEQUELIZE Y MONGOOSE
    this.email = email;
    this.name = name;
    this.password = password;
    this.games = games;
    this.registrationDate = new Date();
  }

  newGame(game: Game) {
    this.games.push(game);
  }

  deleteGames() {
    this.games = [];
  }

  calcSuccesRate() {
    const wins = this.games.filter((game) => game.gameWin).length;
    return (wins / this.games.length) * 100;
  }
  setId(id: string) {
    this._id = id
  }
}

const game1 = new Game(diceRoller);
const game2 = new Game(diceRoller);
const game3 = new Game(diceRoller);

const player1 = new Player("1@1.com","test", "test", [game1, game2, game3]);
player1.newGame(new Game(diceRoller));
player1.newGame(new Game(diceRoller));

console.log(player1.calcSuccesRate());
