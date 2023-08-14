// import { PlayerDocument } from "./mongoDbModel";
import { Request, Response, NextFunction } from "express";
import { User } from "../domain/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sanitizedConfig from "../../config/config";
import { playerService, rankingService } from "./chooseDatabase";
// import { loginHandler } from "../infrastructure/loginHandler";


export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const player = await playerService.findPlayerByEmail(email);

    // const token = await loginHandler(player, password);

    if (!player) {
      return res.status(401).json({ error: "no player found with this email" });
    }

    const passwordMatch = await bcrypt.compare(password, player.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "authentication failed" });
    }

    const token = jwt.sign({ userId: player.id }, sanitizedConfig.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const getPlayers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  playerService
    .getPlayerList()
    .then((players) => {
      if (players) {
        return res.status(200).json(players);
      }
    })
    .catch((err) => {
      next(err);
      //in which scenario we will return this and what will be err.message???
      //return res.status(404).json({ error: err.message, error_code: "GP001" });
    });
};

export const postPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!("email" in req.body) || !("password" in req.body)) {
    return res.status(400).json({ Bad_reqest: "email and password required" });
  }
  const { email, password, name } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User(email, hashedPassword, name);

  playerService
    .createPlayer(newUser)
    .then((response) => {
      return res.status(201).json({ Player_id: response });
    })
    .catch((err: Error) => {
      next(err);
    });
};

export const addGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playerId = req.params.id;
  try {
    const responseFromDatabase = await playerService.addGame(playerId);
    return res.status(200).json({ game_saved: responseFromDatabase });
  } catch (err) {
    next(err);
  }
};

export const deleteAllGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playerId = req.params.id;
  try {
    const player = await playerService.findPlayer(playerId);
    player.deleteGames();
    const responseFromDatabase = await playerService.deleteAllGames(player);
    return res.status(200).json({ games_deleted: responseFromDatabase });
  } catch (err) {
    next(err);
  }
};

export const changeName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playerId = req.params.id;
  const newName = req.body.name;
  try {
    const player = await playerService.changeName(playerId, newName);
    res.status(200).json(player);
  } catch (err) {
    next(err);
  }
};

export const getGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playerId = req.params.id;
  try {
    const games = await playerService.getGames(playerId);
    res.send(games);
  } catch (error) {
    next(error);
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
