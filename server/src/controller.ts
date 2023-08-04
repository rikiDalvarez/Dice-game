import { PlayerDocument } from "./mongoDbModel";
import { Request, Response } from "express";
import { User } from "./domain/User";
import { PlayerService } from "./application/PlayerService";
import { PlayerMongoDbManager } from "./infrastructure/mongoDbManager";
export const getUsers = async (_req: Request, res: Response) => {
	const player = await PlayerDocument.find();
  res.send(player);
};


const playerMongoManager = new PlayerMongoDbManager()
const playerService = new PlayerService(playerMongoManager)

export const postPlayer = async (req: Request, res: Response) => {
	if (!('email' in req.body) || !('password' in req.body)){
		return res.status(400).json({Bad_reqest: "email and password required"})
	}
  const { email, password, name } = req.body;
  const newUser = new User(email, password, name);
  playerService.createPlayer(newUser)
  res.status(201).send(newUser)

  //const player1 = new PlayerDocument({ name: "player1" });
  //const savedPlayer = await player1
   // .save()
    //.then(() => console.log("player saved"));
  //console.log(savedPlayer);
  //res.send(savedPlayer);
};
