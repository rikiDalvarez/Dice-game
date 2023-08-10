import "dotenv/config";
import config from "../config/config";
import { app } from "./app";
import { connectDatabase } from "./infrastructure/mongoDbConnection";
import { PlayerType } from "./domain/Player";
import { playerSchema } from "./infrastructure/models/mongoDbModel";
import {
  connectMySQLDatabase,
  createDatabase,
  sequelize,
} from "./infrastructure/mySQLConnection";
import { GameSQL } from "./infrastructure/models/mySQLModels/GameMySQLModel";
import { PlayerSQL } from "./infrastructure/models/mySQLModels/PlayerMySQLModel";

export const server = app.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}! 🍄 `);
});

export const mongoDbConnection = connectDatabase(
  config.MONGO_URI,
  config.DATABASE
);

export const mongoPlayerDocument = mongoDbConnection.model<PlayerType>(
  "Player",
  playerSchema
);

// it needs to be fixed the code I think it won't work to choose database

const mongoDB = true;

const chooseDatabase = async () => {
  if (mongoDB) {
    return mongoDbConnection;
  }
  await createDatabase();
  await connectMySQLDatabase();
  PlayerSQL.hasMany(GameSQL, {
    foreignKey: "player_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  await sequelize.sync();
};

chooseDatabase();
