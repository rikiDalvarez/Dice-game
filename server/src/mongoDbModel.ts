import mongoose from "mongoose";
import {Game} from "./domain/Game"


const playerSchema = new mongoose.Schema({
  name: String,
  password: String,
  registrationDate: Date,
  successRate: Number,
  games: Array<Game>,
});

export const PlayerDocument = mongoose.model("Player", playerSchema);