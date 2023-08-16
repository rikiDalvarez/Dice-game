import { Ranking } from "../domain/Ranking";
import config from "../../config/config";
import {
  PlayerMongoDbManager,
  RankingMongoDbManager,
} from "./mongo/mongoDbManager";
import { PlayerMySQLManager, RankingMySQLManager } from "./mySql/mySQLManager";
import { PlayerService } from "../application/PlayerService";
import { RankingService } from "../application/RankingService";
import { Connection, Model } from "mongoose";
import { Sequelize } from "sequelize";
import { PlayerType } from "../domain/Player";
import { playerSchema } from "./mongo/mongoDbModel";
import { connectDatabase } from "./mongo/mongoDbConnection";
import {
  createSQLConnection,
  createSQLDatabase,
  testSQLConnection,
} from "./mySql/mySQLConnection";
import { initializationGameTable } from "./mySql/models/GameMySQLModel";
import { initializationPlayerTable } from "./mySql/models/PlayerMySQLModel";
import { createSQLTableRelations } from "./mySql/models/tableRelations";

const ranking = new Ranking();

//initiallize abstract manager
let playerManager: PlayerMongoDbManager | PlayerMySQLManager;
let rankingManager: RankingMongoDbManager | RankingMySQLManager;

//connection variables mongo
export let mongoConnection: Connection;
export let mongoPlayerDocument: Model<PlayerType>;

//connection variables seequelize
export let sequelize: Sequelize;

if (config.NODE_ENV === "mongo") {
  //initialize connection with mongoDatabase and mongoModel
  mongoConnection = connectDatabase(config.MONGO_URI, config.DATABASE);
  mongoPlayerDocument = mongoConnection.model<PlayerType>(
    "Player",
    playerSchema
  );
  //abstracting mongoManager
  playerManager = new PlayerMongoDbManager();
  rankingManager = new RankingMongoDbManager(ranking);
} else {
  //initialize connection with mySqlDatabase
  createSQLDatabase();
  sequelize = createSQLConnection();

  testSQLConnection(sequelize);
  initializationGameTable(sequelize);
  initializationPlayerTable(sequelize);
  createSQLTableRelations(sequelize);

  //abstracting sqlManager
  playerManager = new PlayerMySQLManager();
  rankingManager = new RankingMySQLManager(ranking);
}

export const playerService = new PlayerService(playerManager);
export const rankingService = new RankingService(rankingManager);
