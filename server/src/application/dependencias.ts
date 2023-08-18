import { Ranking } from "../domain/Ranking";
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
import { PlayerInterface } from "./PlayerInterface";
import { RankingInterface } from "./RankingInterface";
import { Sequelize } from "sequelize";
import { InitDataBase } from "../dataBaseSetup";


export type Dependencias ={
  playerService: PlayerService,
  rankingService: RankingService
}


export function setUpDependencias(dataBaseConectionDetails: InitDataBase) {
  const ranking = new Ranking();

  let playerManager: PlayerInterface;
  let rankingManager: RankingInterface;

  if (dataBaseConectionDetails.databaseType === "mongo") {
    const playerDocument = dataBaseConectionDetails.document;
    if (!playerDocument) {
      throw new Error("document must exist for mongo");
    }

    playerManager = new PlayerMongoDbManager(playerDocument);
    rankingManager = new RankingMongoDbManager(playerDocument, ranking);
  } else {
    const sequelize = dataBaseConectionDetails.connection as Sequelize;
    playerManager = new PlayerMySQLManager(sequelize);
    rankingManager = new RankingMySQLManager(sequelize, ranking);
  }

  const playerService = new PlayerService(playerManager);
  const rankingService = new RankingService(rankingManager);

  return { playerService, rankingService };
}

/*

export async function initMongoDatabase(): Promise<object> {

    connection = connectDatabase(config.MONGO_URI, dataBaseName);
    const playerDocument = connection.model<PlayerType>("Player", playerSchema);
    
    return {connection, playerDocument}
  } 

  export async function initSQLDatabase(): Promise<void> {
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
  */
