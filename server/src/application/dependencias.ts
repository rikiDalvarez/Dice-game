import { Ranking } from "../domain/Ranking";
import config from "../../config/config";
import {
  PlayerMongoDbManager,
  RankingMongoDbManager,
} from "../infrastructure/mongoDbManager";
import {
  PlayerMySQLManager,
  RankingMySQLManager,
} from "../infrastructure/mySQLManager";
import { PlayerService } from "./PlayerService";
import { RankingService } from "./RankingService";
import { Connection, Model } from "mongoose";
import { Sequelize } from "sequelize";
import { PlayerType } from "../domain/Player";
import { playerSchema } from "../infrastructure/models/mongoDbModel";
import { connectDatabase } from "../infrastructure/mongoDbConnection";
import {
    createSQLConnection,
  createSQLDatabase,
  testSQLConnection,
} from "../infrastructure/mySQLConnection";
import { initializationGameTable } from "../infrastructure/models/mySQLModels/GameMySQLModel";
import { initializationPlayerTable } from "../infrastructure/models/mySQLModels/PlayerMySQLModel";
import { createSQLTableRelations } from "../infrastructure/models/mySQLModels/tableRelations";

const isMongo = config.NODE_ENV === "mongo";
const ranking = new Ranking();

let playerManager: PlayerMongoDbManager | PlayerMySQLManager;
let rankingManager: RankingMongoDbManager | RankingMySQLManager;

export let connection: Connection 
export let sequelize: Sequelize;
export let mongoPlayerDocument: Model<PlayerType>;

if (isMongo) {
  connection = connectDatabase(config.MONGO_URI, config.DATABASE);
  mongoPlayerDocument = connection.model<PlayerType>("Player", playerSchema);
  playerManager = new PlayerMongoDbManager();
  rankingManager = new RankingMongoDbManager(ranking);
} else {
  createSQLDatabase()
  sequelize = createSQLConnection();
  testSQLConnection(sequelize)
  initializationGameTable(sequelize)
  initializationPlayerTable(sequelize)
  createSQLTableRelations(sequelize)
  
  playerManager = new PlayerMySQLManager();
  rankingManager = new RankingMySQLManager(ranking);
}

export const playerService = new PlayerService(playerManager);
export const rankingService = new RankingService(rankingManager);

