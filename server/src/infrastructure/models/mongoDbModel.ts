import mongoose from "mongoose";
import { GameType } from "../../domain/Player";

export const playerSchema = new mongoose.Schema({
  name: {type:String,  index: {
    unique: true,
    partialFilterExpression: {name: {$type: "string"}}
  } },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: function (value: string) {
      const emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailRegex.test(value);
    },
  },
  password: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  successRate: {
    type: Number,
    required: true,
  },
  games: {
    type: Array<GameType>,
    required: true,
  },
});


