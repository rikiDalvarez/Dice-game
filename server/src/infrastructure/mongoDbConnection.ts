import mongoose from "mongoose";
//import { PlayerType } from "../domain/Player";
//import { playerSchema } from "./models/mongoDbModel";


export function connectDatabase (
  url: string,
  dbName: string
): mongoose.Connection{
  try {
    const options = {
      dbName,
    };

    const connection =  mongoose.createConnection(url, options);
    //const PModel = connection.model<PlayerType>("player",
    //playerSchema)
    console.log("Connected to the database 🌱");
    return connection
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}


