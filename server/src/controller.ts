import { PlayerDocument } from "./mongoDbModel";
import { Request, Response } from "express";
import { User } from "./domain/User";

export const getUsers = async (_req: Request, res: Response) => {
  const player = await PlayerDocument.find();
  res.send(player);
};

export const postPlayer = async (req: Request, res: Response) => {
	if (!('email' in req.body) || !('password' in req.body)){
		return res.status(400).json({Bad_reqest: "email and password required"})
	}

	const newUser = new User("user1", "email")

  const player1 = new PlayerDocument({ name: "player1" });
  const savedPlayer = await player1
    .save()
    .then(() => console.log("player saved"));
  console.log(savedPlayer);
  res.send(savedPlayer);
};
