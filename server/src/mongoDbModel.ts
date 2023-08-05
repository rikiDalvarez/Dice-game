import mongoose from "mongoose";
import { Game } from "./domain/Game";
import {PlayerType } from "./domain/Player";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, match: /.+\@.+\..+/, unique: true },
  name: { type: String, default: "unknown" },

  //   readonly email: string;
  //   readonly name?: string;
  //   readonly password: string;
  //   readonly registrationDate: Date;

  //   constructor(
  //     name: string = "unknown",
  //     email: string,
  //     password: string,
  //   ) {
  //     this.email = email;
  //     this.name = name;
  //     this.password = password;
  //     this.registrationDate = new Date();
  //   }
  // }
});

const playerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  registrationDate: Date,
  successRate: Number,
  games: Array<Game>,
});

export const PlayerDocument = mongoose.model<PlayerType>("Player", playerSchema);
