// import { PlayerDocument } from "./mongoDbModel";
import { Request, Response, NextFunction } from "express";
import { User } from "../domain/User";
import { Ranking } from "../domain/Ranking";
import { PlayerService } from "./PlayerService";
import {
  PlayerMongoDbManager,
  RankingMongoDbManager,
} from "../infrastructure/mongoDbManager";
import { RankingService } from "./RankingService";

const playerMongoManager = new PlayerMongoDbManager();
const playerService = new PlayerService(playerMongoManager);
const ranking = new Ranking();
const rankingMongoDbManager = new RankingMongoDbManager(ranking);
const rankingService = new RankingService(rankingMongoDbManager);

export const getPlayers = async (req: Request, res: Response) => {
  playerService
    .getPlayerList()
    .then((players) => {
      if (players) {
        return res.status(200).json(players);
      }
    })
    .catch((err) => {
      return res.status(404).json({ error: err.message, error_code: "GP001" });
    });
};

export const postPlayer = async (req: Request, res: Response, next:NextFunction) => {
  if (!("email" in req.body) || !("password" in req.body)) {
    return res.status(409).json({ Bad_reqest: "email and password required" });
  }
  const { email, password, name } = req.body;
  const newUser = new User(email, password, name);

  playerService
    .createPlayer(newUser)
    .then((response) => {
      return res.status(201).json({ Player_id: response });
    })
    .catch((err:Error) => {
      next(err)
    }); 
};

export const playGame = async (req: Request, res: Response) => {
  console.log(`req: ${req.body}`);
  const playerId = req.params.id;

  try {
    const responseFromDatabase = await playerService.addGame(playerId);
    return res.status(200).json({ game_saved: responseFromDatabase });
  } catch (err) {
    return res.status(500).json({ error: err, error_code: "PG001" });
  }
};

export const deleteAllGames = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  try {
    const player = await playerService.findPlayer(playerId);
    player.deleteGames();
    const responseFromDatabase = await playerService.deleteAllGames(player);
    return res.status(200).json({ games_deleted: responseFromDatabase });
  } catch (err) {
    return res.status(500).json({ error: err, error_code: "DAG001" });
  }
};


export const changeName = async (req: Request, res: Response, next:NextFunction) => {
  const playerId = req.params.id;
  const newName = req.body.name;
  try{
  const player = await playerService.changeName(playerId, newName)
  res.status(200).json(player);

}
  catch (err) {next(err)}
 
};

export const getGames = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  try {
    const games = await playerService.getGames(playerId);
    res.send(games);
  } catch (error) {
    res.status(500).json({ error: "Error getting games", error_code: "GG001" });
  }
};

//refactoring of getRankingAndAvarage
export const getRankingWithAverage = async (req: Request, res: Response) => {
  try {
    const ranking = await rankingService.getRankingWithAverage();
    res
      .status(200)
      .json({ ranking: ranking.rankingList, average: ranking.average });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error getting ranking", error_code: "GR001" });
  }
};

export const getWinner = async (req: Request, res: Response) => {
  try {
    const ranking = await rankingService.getWinner();
    res.status(200).json(ranking.winners);
  } catch (error) {
    res.status(500).json({ error: `${error}`, error_code: "GW001" });
  }
};

export const getLoser = async (req: Request, res: Response) => {
  try {
    const ranking = await rankingService.getLoser();
    res.status(200).json(ranking.losers);
  } catch (error) {
    res.status(500).json({ error: `${error}`, error_code: "GL001" });
  }
};

