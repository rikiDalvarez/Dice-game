import "dotenv/config";
import config from "../config/config";
import { app } from "./app";
import { connectDatabase } from "./infrastructure/mongoDbConnection";
import { Player, PlayerType } from "./domain/Player";
import { playerSchema } from "./infrastructure/models/mongoDbModel";
import { connectMySQLDatabase, createDatabase } from "./infrastructure/mySQLConnection";
import { GameSQL } from "./infrastructure/models/mySQLModels/GameMySQLModel";
import { PlayerSQL } from "./infrastructure/models/mySQLModels/PlayerMySQLModel";

export const server = app.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}! 🍄 `);
});

export const dbConnection = connectDatabase(config.MONGO_URI, config.DATABASE);
export const PlayerDocument = dbConnection.model<PlayerType>(
  "Player",
  playerSchema
)

// it needs to be fixed the code I think it won't work to choose database

const mongoDB = false;

const chooseDatabase = async () => {
  if (mongoDB) {
    return dbConnection;
  }
  await createDatabase();
  await connectMySQLDatabase()
  await PlayerSQL.sync();
  await GameSQL.sync();
}

chooseDatabase()