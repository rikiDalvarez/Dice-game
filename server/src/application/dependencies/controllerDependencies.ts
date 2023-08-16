import config from "../../../config/config";
import { PlayerMongoDbManager } from "../../infrastructure/mongoDbManager";
import { PlayerService } from "../PlayerService";
import { RankingService } from "../RankingService";
import { mongoDependencies } from "./mongoDependecies";
import { mySQLDependencies } from "./sqlDependencies";

export let playerService: PlayerService
export let rankingService: RankingService
export let playerMongoManager: PlayerMongoDbManager | undefined

const chooseDatabase = async () => {
  if (config.NODE_ENV === "mongo") {
    const services = await mongoDependencies();
    return {
      playerMongoManager: services.playerMongoManager,
      playerService: services.playerService,
      rankingService: services.rankingService
    }
  } else {
    const services = await mySQLDependencies();
    return {
      playerService: services.playerService,
      rankingService: services.rankingService
    };
  }
}

chooseDatabase().then(services => {
  return { playerService, rankingService, playerMongoManager } = services;
});

