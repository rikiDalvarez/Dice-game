import { Ranking } from "../../domain/Ranking";
import { PlayerService } from "../PlayerService";
import {
  PlayerMongoDbManager,
  RankingMongoDbManager,
} from "../../infrastructure/mongoDbManager";
import { RankingService } from "../RankingService";
import "dotenv/config";
import config from "../../../config/config";
import { PlayerType } from "../../domain/Player";
import { playerSchema } from "../../infrastructure/models/mongoDbModel";
import { connectDatabase } from "../../infrastructure/mongoDbConnection";

export const mongoDbConnection = connectDatabase(config.MONGO_URI, config.DATABASE);

const ranking = new Ranking();

export const mongoPlayerDocument = mongoDbConnection.model<PlayerType>(
  "Player",
  playerSchema
);

export const mongoDependencies = () => {
  const playerMongoManager = new PlayerMongoDbManager();
  const playerService = new PlayerService(playerMongoManager);
  const rankingMongoDbManager = new RankingMongoDbManager(ranking);
  const rankingService = new RankingService(rankingMongoDbManager);
  return {
    playerMongoManager,
    playerService,
    rankingService
  }
}
