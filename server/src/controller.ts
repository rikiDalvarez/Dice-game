// import { PlayerDocument } from "./mongoDbModel";
import { Request, Response } from "express";
import { User } from "./domain/User";
import { Ranking } from "./domain/Ranking";
import { PlayerService } from "./application/PlayerService";
import {
  PlayerMongoDbManager,
  RankingMongoDbManager,
} from "./infrastructure/mongoDbManager";
import { RankingService } from "./application/RankingService";

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
      throw err;
    }); // add res.status(500) for the error
};

export const postPlayer = async (req: Request, res: Response) => {
  if (!("email" in req.body) || !("password" in req.body)) {
    return res.status(400).json({ Bad_reqest: "email and password required" });
  }
  const { email, password, name } = req.body;
  const newUser = new User(email, password, name);

  playerService
    .createPlayer(newUser)
    .then((response) => {
      return res.status(201).json({ Player_id: response });
    })
    .catch((err) => {
      throw err;
    }); // add res.status(500) for the error
};

export const playGame = async (req: Request, res: Response) => {
  //should return if winner or not
  console.log(`req: ${req.body}`);
  const playerId = req.params.id;
  try {
    const responseFromDatabase = await playerService.addGame(playerId);
    return res.status(200).json({ game_saved: responseFromDatabase });
  } catch (err) {
    return err;
  }
};

export const deleteAllGames = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  try {
    const player = await playerService.findPlayer(playerId);
    // add res.status(400) for error when id not found
    player.deleteGames();
    const responseFromDatabase = await playerService.deleteAllGames(player);
    return res.status(200).json({ games_deleted: responseFromDatabase });
  } catch (err) {
    // add res.status(500) for the error
    return err;
  }
};
export const changeName = async (req: Request, res: Response) => {
  //return new name
  const playerId = req.params.id;
  const newName = req.body.name;
  const player = await playerService.changeName(playerId, newName);
  if (!player) {
    res.status(500).json({ error: "Error changing name" });
  }
  res.status(200).json(player);
};

export const getGames = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  const games = await playerService.getGames(playerId);
  res.send(games);
};

//refactoring of getRankingAndAvarage
export const getRankingWithAverage = async (req: Request, res: Response) => {
  console.log('ranking service')
  const ranking = await rankingService.getRankingWithAverage()
  //const ranking = await rankingService.getPlayersRanking();
  //const rankingAv = await rankingService.getMeanSuccesRate();
  res
    .status(200)
    .json({ ranking: ranking.rankingList, average: ranking.average });
};

export const getWinner = async (req: Request, res: Response) => {
  const ranking = await rankingService.getWinner();
  // if (ranking.winners.length === 0) {
  // res.status(500).json({ error: "Error getting winner(s)" });
  //}
  res.status(200).json(ranking.winners);
};

export const getLoser = async (req: Request, res: Response) => {
  const ranking = await rankingService.getLoser();
  //if (!losers) {
  // res.status(500).json({ error: "Error getting loser(s)" });
  //}
  res.status(200).json(ranking.losers);
};
