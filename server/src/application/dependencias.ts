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
import { Connection } from "mongoose";
import { Sequelize } from "sequelize";
import { PlayerType } from "../domain/Player";
import { playerSchema } from "../infrastructure/models/mongoDbModel";
import { connectDatabase } from "../infrastructure/mongoDbConnection";
import {
  createSequelizer,
  createSQLDatabase,
} from "../infrastructure/mySQLConnection";
import { initializeGameTable } from "../infrastructure/models/mySQLModels/GameMySQLModel";
import { PlayerInterface } from "./PlayerInterface";
import { RankingInterface } from "./RankingInterface";
import { createSQLTableRelations } from "../infrastructure/models/mySQLModels/tableRelations";
import { initializePlayerTable } from "../infrastructure/models/mySQLModels/PlayerMySQLModel";


export let dataBaseName: string;
if (config.NODE_ENV === "production" || config.NODE_ENV === "dev") {
  dataBaseName = config.DATABASE;
} else {
  dataBaseName = config.TEST_DATABASE;
}

//const isMongo = config.DATABASE_ENV === "mongo";
const isMongo = true;
const ranking = new Ranking();

let playerManager: PlayerInterface;
let rankingManager: RankingInterface;

export let connection: Connection;
export let sequelize: Sequelize;

export async function initDatabase(): Promise<void> {
  if (isMongo) {
    connection = connectDatabase(config.MONGO_URI, dataBaseName);
    const playerDocument = connection.model<PlayerType>("Player", playerSchema);
    playerManager = new PlayerMongoDbManager(playerDocument);
    rankingManager = new RankingMongoDbManager(playerDocument, ranking);
    return Promise.resolve();
  } else {
    await createSQLDatabase(dataBaseName, {
      host: config.HOST,
      user: config.MYSQL_USER,
      password: config.MYSQL_PASSWORD,
    });
    sequelize = createSequelizer(
      dataBaseName,
      config.MYSQL_USER,
      config.MYSQL_PASSWORD,
      config.HOST
    );
    initializeGameTable(sequelize);
    initializePlayerTable(sequelize);
    await createSQLTableRelations(sequelize);
  }
}

playerManager = new PlayerMySQLManager();
rankingManager = new RankingMySQLManager(ranking);
export const playerService = new PlayerService(playerManager);
export const rankingService = new RankingService(rankingManager);


