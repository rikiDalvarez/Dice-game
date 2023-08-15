import { Ranking } from "../../domain/Ranking";
import { PlayerService } from ".././PlayerService";
import {
  PlayerMongoDbManager,
  RankingMongoDbManager,
} from "../infrastructure/mongoDbManager";
import { RankingService } from "../application/RankingService";
import config from "../../config/config";
import { connectDatabase } from "../infrastructure/mongoDbConnection";
import { connectMySQLDatabase } from "../infrastructure/mySQLConnection";

export let dataBaseConnection;
const isMongo = config.NODE_ENV === "mongo";

if (isMongo) {
  dataBaseConnection = connectDatabase(config.MONGO_URI, config.DATABASE);
} else {
  dataBaseConnection = connectMySQLDatabase();
}

/*
const mongoDBConnection = 'finction para hacer connection'
mongoPlayerDocument = mongoDbConnection.model<PlayerType>(
    "Player",
    playerSchema
  );

*/

const ranking = new Ranking();
function runMongo() {
  const playerMongoManager = new PlayerMongoDbManager();
  const playerService = new PlayerService(playerMongoManager);
  const rankingMongoDbManager = new RankingMongoDbManager(ranking);
  const rankingService = new RankingService(rankingMongoDbManager);
  return {
    playerMongoManager,
    playerService,
    rankingService,
  };
}

if (config.NODE_ENV === "mongo") {
  runMongo();
} else {
  sqlDependencies;
}
