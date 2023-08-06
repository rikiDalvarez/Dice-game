import mongoose from "mongoose";
import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";

const playerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  registrationDate: Date,
  successRate: Number,
  games: Array<Game>,
});

export const PlayerDocument = mongoose.model<Player>("Player", playerSchema);
