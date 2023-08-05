import { PlayerDocument } from "./mongoDbModel";
import { Request, Response } from "express";
import { User } from "./domain/User";
import { PlayerService } from "./application/PlayerService";
import { PlayerMongoDbManager } from "./infrastructure/mongoDbManager";
import { RankingService } from "./application/RankingService";
import { PlayerList } from "./domain/PlayerList";
import { Game } from "./domain/Game";
import { Dice } from "./domain/Dice";

const dice = new Dice();
const playerMongoManager = new PlayerMongoDbManager();
const playerService = new PlayerService(playerMongoManager);
const rankingService = new RankingService(playerMongoManager);

export const getPlayers = async (req: Request, res: Response) => {
  playerService
    .getPlayerList()
    .then((players) => {
      if (players) {
        return res.status(201).json(new PlayerList(players));
      }
    })
    .catch((err) => {
      throw err;
    });  // add res.status(500) for the error
};

export const postPlayer = async (req: Request, res: Response) => {
  if (!("email" in req.body) || !("password" in req.body)) {
    return res.status(400).json({ Bad_reqest: "email and password required" });
  }
  const { email, password, name } = req.body;
  const newUser = new User(email, password, name);
  playerService.createPlayer(newUser).then((response)=>
  {return res.status(201).json({Player_id: response.id})}).catch((err)=>{throw err}) // add res.status(500) for the error
  
};

export const playgame = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  try {
  const player = await playerService.readPlayer(playerId)
   // add res.status(400) for error when id not found
  const game = new Game(dice)
  player.addNewGame(game)
  const responseFromDatabase = await playerService.addGame(player)
  return res.status(200).json({game_saved: responseFromDatabase})}catch(err){  // add res.status(500) for the error
    return err
  }
};

export const deleteAllGames = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  try {
  const player = await playerService.readPlayer(playerId)
  // add res.status(400) for error when id not found
  player.deleteGames()
  const responseFromDatabase = await playerService.deleteAllGames(player)
  return res.status(200).json({games_deleted: responseFromDatabase})}catch(err){
    return err
  }
};
