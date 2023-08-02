import { Game } from "./Game";
import { DiceRoller } from "./DiceRoller";

const diceRoller = new DiceRoller()


export class Player {
    //  _id: string; NO HAY QUE PONERLO, SE GENERA CON SEQUELIZE Y MONGOOSE
    //TO DISCUSS:
    //But we have to identify instances of User class. 
    //When we get data from database we will get user id.
    //If we don't use it during inicialization of instance 
    //how we will know which belongs to which user?
    name: string;
    password: string;
    registrationDate: Date;
    games: Array<Game>;
  
    constructor(
      //    _id: string, NO HAY QUE PONERLO, SE GENERA CON SEQUELIZE Y MONGOOSE
      name: string = "NO NAME",
      password: string,
      games: Array<Game>
    ) {
      //    this._id = _id; NO HAY QUE PONERLO, SE GENERA CON SEQUELIZE Y MONGOOSE
      this.name = name;
      this.password = password;
      this.games = games;
      this.registrationDate = new Date()
    }
  
    newGame(game:Game) {
      this.games.push(game);
    }
  
    deleteGames() {
      this.games = [];
    }
  
    calcSuccesRate() {
      const wins = this.games.filter((game) => game.gameWin).length;
      //const losses = this.games.length - wins;
      //return (wins / losses) * 100;
      return wins/this.games.length *100
    }
  }

  const game1 = new Game(diceRoller);
const game2 = new Game(diceRoller);
const game3 = new Game(diceRoller);


const player1 = new Player("test", "test", [game1, game2, game3]);
player1.newGame(new Game(diceRoller));
player1.newGame(new Game(diceRoller));



console.log(player1.calcSuccesRate());