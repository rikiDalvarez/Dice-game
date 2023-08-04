import {PlayerDocument} from "./mongoDbModel";
import { Request, Response } from "express";
import { Game } from "./domain/Game";
import { Dice } from "./domain/Dice";

const dice = new Dice()
const a = new Game(dice)
console.log(a)

export const getUsers = async (_req: Request, res: Response) => {
	const player = await PlayerDocument.find();
	res.send(player);
}

export const postPlayer = async (_req: Request, res: Response) => {
	
	const player1 = new PlayerDocument({ name: "player1" })
	const savedPlayer = await player1.save().then(() => console.log("player saved"));
	console.log(savedPlayer)
	res.send(savedPlayer);
}