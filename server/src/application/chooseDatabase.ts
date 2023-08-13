import { Ranking } from "../domain/Ranking";
import config from "../../config/config";
import { PlayerService } from "./PlayerService";
import { PlayerMongoDbManager, RankingMongoDbManager } from "../infrastructure/mongoDbManager";
import { RankingService } from "./RankingService";
import { PlayerMySQLManager, RankingMySQLManager } from "../infrastructure/mySQLManager";

const isMongo = config.NODE_ENV === 'mongo'
// const isMongo = true
export const chooseDatabase = () => {
    const ranking = new Ranking();
    if (isMongo) {
        const playerMongoManager = new PlayerMongoDbManager();
        const playerService = new PlayerService(playerMongoManager);
        const rankingMongoDbManager = new RankingMongoDbManager(ranking);
        const rankingService = new RankingService(rankingMongoDbManager);
        return {
            playerMongoManager,
            playerService,
            rankingService
        };
    } else {
        const playerMySQLManager = new PlayerMySQLManager();
        const playerService = new PlayerService(playerMySQLManager);
        const rankingMySQLManager = new RankingMySQLManager(ranking);
        const rankingService = new RankingService(rankingMySQLManager);
        return {
            playerService,
            rankingService,
        };
    }
};

const services = chooseDatabase();
export const playerService = services.playerService;
export const rankingService = services.rankingService;
export const playerMongoManager = services.playerMongoManager;