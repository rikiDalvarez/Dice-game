import "dotenv/config";
import config from "./config/config";
import express from "express";
import mongoose from "mongoose";

// Express
const app = express();
const router = express.Router();

// Middlewares
app.use(express.json());
app.use("/api", router);

// Routes
router.get("/", async (req, res) => {
  const player = await PlayerDocument.find();
  res.send(player);
});


// Database
mongoose.connect(config.MONGO_URI, {
  dbName: config.DATABASE,
});
//schema
const playerSchema = new mongoose.Schema({
  name: String,
  password: String,
  registrationDate: Date,
  successRate: Number,
  games: Array<Game>,
});
//model
const PlayerDocument = mongoose.model("Player", playerSchema);
//instance
const player55 = new PlayerDocument({ name: "player55UHU" });
//save
async function savePlayer(player: mongoose.Document) {
  await player.save().then(() => console.log("player saved"));
}
savePlayer(player55);


// //route
// router.post("/insertUser", async (req,res) => {
//   const  player4 = new PlayerDocument({name: "player4"})
//   const addPlayer = new Player(player4.name, "password", [])
//   savePlayer(player4);
  
// })


// Server
app.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}! 🍄 `);
});

class Game {
  gameWin: boolean;
  dice1Value: number;
  dice2Value: number;

  constructor() {
    this.dice1Value = this.rollDice();
    this.dice2Value = this.rollDice();
    this.gameWin = this.isWin();
  }

  isWin() {
    return this.dice1Value + this.dice2Value === 7 ? true : false;
  }

  rollDice() {
    return Math.ceil(Math.random() * 6);
  }
}

const game = new Game();
game.rollDice();

///////////////

class Player {
  //  _id: string; NO HAY QUE PONERLO, SE GENERA CON SEQUELIZE Y MONGOOSE

  name: string;
  password: string;
  registrationDate: Date;
  successRate: number;
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
    this.registrationDate = new Date();
    this.successRate = this.calcPercentage();
  }

  newGame() {
    const game = new Game();
    this.games.push(game);
  }

  deleteGames() {
    this.games = [];
  }

  calcPercentage() {
    const wins = this.games.filter((game) => game.gameWin).length;
    console.log({ wins });
    const losses = this.games.length - wins;
    console.log({ losses });
    return (wins / losses) * 100;
  }
}

const game1 = new Game();
const game2 = new Game();
const game3 = new Game();

//const player2 = new Player("player2", "player2", [game1, game2, game3]);

const player1 = new Player("test", "test", [game1, game2, game3]);
player1.newGame();
player1.newGame();

console.log(player1.calcPercentage());

console.log(player1);
