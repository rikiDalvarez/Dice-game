import "dotenv/config";
import config from "../config/config";
import { app } from "./app";
import { connectDatabase } from "./infrastructure/mongoDbConnection";
import { PlayerType } from "./domain/Player";
import { playerSchema } from "./infrastructure/models/mongoDbModel";
import "dotenv/config";

export const server = app.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}! 🍄 `);
});

console.log(process.env.JWT_SECRET);
export const dbConnection = connectDatabase(config.MONGO_URI, config.DATABASE);
export const PlayerDocument = dbConnection.model<PlayerType>(
  "Player",
  playerSchema
);
