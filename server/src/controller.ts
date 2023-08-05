// import { PlayerDocument } from "./mongoDbModel";
import { Request, Response } from "express";
import { User } from "./domain/User";
import { PlayerService } from "./application/PlayerService";
import { PlayerMongoDbManager, RankingMongoDbManager } from "./infrastructure/mongoDbManager";
import { RankingService } from "./application/RankingService";
import { Game } from "./domain/Game";
import { Dice } from "./domain/Dice";

const dice = new Dice();
const playerMongoManager = new PlayerMongoDbManager();
const playerService = new PlayerService(playerMongoManager);
const rankingMongoDbManager = new RankingMongoDbManager();
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
      return res.status(201).json({ Player_id: response});
    })
    .catch((err) => {
      throw err;
    }); // add res.status(500) for the error
};

export const playGame = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  try {
    console.log('gram')
    const player = await playerService.readPlayer(playerId);
    // add res.status(400) for error when id not found
    console.log(player)
    const game = new Game(dice);
    console.log(game)
    player.addNewGame(game);
    const responseFromDatabase = await playerService.addGame(player);
    return res.status(200).json({ game_saved: responseFromDatabase });
  } catch (err) {
    // add res.status(500) for the error
    return err;
  }
};

export const deleteAllGames = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  try {
    const player = await playerService.readPlayer(playerId);
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

export const getRankingAndAverage = async (req: Request, res: Response) => {
  const playersRanking = await rankingService.getPlayersRanking()
  const average = await rankingService.getMeanSuccesRate()
  const ranking = playersRanking.ranking
  res.status(200).json({ ranking, average: average })
}
