import mongoose from "mongoose";
//import { PlayerType } from "../domain/Player";
//import { playerSchema } from "./models/mongoDbModel";

export function connectDatabase(
  url: string,
  dbName: string
): mongoose.Connection {
  try {
    const options = { dbName };

    const mongoConnection = mongoose.createConnection(url, options);
    console.log("Connected to the database 🌱");
    return mongoConnection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}
