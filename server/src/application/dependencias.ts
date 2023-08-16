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
import { Connection} from "mongoose";
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
import { PlayerInterface } from "./PlayerInterface";
import { RankingInterface } from "./RankingInterface";


export let dataBaseName: string;
if (config.NODE_ENV === "production"|| config.NODE_ENV === "dev"){
  dataBaseName = config.DATABASE
}else {
  dataBaseName = config.TEST_DATABASE
}

const isMongo = config.DATABASE_ENV === "mongo";
//const isMongo = false
const ranking = new Ranking();

let playerManager: PlayerInterface
let rankingManager: RankingInterface

export let connection: Connection 
export let sequelize: Sequelize;

if (isMongo) {
  connection = connectDatabase(config.MONGO_URI, dataBaseName);
  const playerDocument = connection.model<PlayerType>("Player", playerSchema);
  playerManager = new PlayerMongoDbManager(playerDocument);
  rankingManager = new RankingMongoDbManager(playerDocument,ranking);
} else {
  createSQLDatabase(dataBaseName, {
    host: config.HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
  })
  sequelize = createSQLConnection( dataBaseName,
    config.MYSQL_USER,
    config.MYSQL_PASSWORD,
     config.HOST,
    );
  testSQLConnection(sequelize)
  initializationGameTable(sequelize)
  initializationPlayerTable(sequelize)
  createSQLTableRelations(sequelize)
  
  playerManager = new PlayerMySQLManager();
  rankingManager = new RankingMySQLManager(ranking);
}

export const playerService = new PlayerService(playerManager);
export const rankingService = new RankingService(rankingManager);

