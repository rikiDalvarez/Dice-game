import { Ranking } from "../../domain/Ranking";
import { PlayerService } from ".././PlayerService";
import {
  PlayerMongoDbManager,
  RankingMongoDbManager,
} from "../../infrastructure/mongoDbManager";
import { RankingService } from "../RankingService";
import "dotenv/config";

const ranking = new Ranking();

export const mongoDependencies = () => {
  const playerMongoManager = new PlayerMongoDbManager();
  const playerService = new PlayerService(playerMongoManager);
  const rankingMongoDbManager = new RankingMongoDbManager(ranking);
  const rankingService = new RankingService(rankingMongoDbManager);
  return {
    playerMongoManager,
    playerService,
    rankingService,
  };
};

// export let mongoDbConnection: Connection;
// export let mongoPlayerDocument: Model<PlayerType>;

// const chooseDatabase = async () => {
// 	if (isMongo) {
// 		mongoDbConnection = connectDatabase(config.MONGO_URI, config.DATABASE);
// 		mongoPlayerDocument = mongoDbConnection.model<PlayerType>(
// 			"Player",
// 			playerSchema
// 		);

// 		return { mongoDbConnection, mongoPlayerDocument };
// 	}
// }

/* 
    
    export const mongoPlayerDocument = mongoDbConnection.model<PlayerType>(
    "Player",
    playerSchema
    );

    const ranking = new Ranking();

    export const mongoDependencies = () => {
        const playerMongoManager = new PlayerMongoDbManager();
        const playerService = new PlayerService(playerMongoManager);
        const rankingMongoDbManager = new RankingMongoDbManager(ranking);
        const rankingService = new RankingService(rankingMongoDbManager);
        return {
            playerMongoManager,
            playerService,
            rankingService
        };
 */
