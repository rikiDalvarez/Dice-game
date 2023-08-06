import mongoose from "mongoose";
import { Game } from "./domain/Game";
import { PlayerType } from "./domain/Player";

//make sure email is unique
const playerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  registrationDate: Date,
  successRate: Number,
  games: Array<Game>,
});

export const PlayerDocument = mongoose.model<PlayerType>(
  "Player",
  playerSchema
);
