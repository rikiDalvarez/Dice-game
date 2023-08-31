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


export function buildServices(databaseType:string, dataBaseConectionDetails: InitDataBase) {
  const ranking = new Ranking();

  let playerManager: PlayerInterface;
  let rankingManager: RankingInterface;

  if (databaseType === "mongo") {
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