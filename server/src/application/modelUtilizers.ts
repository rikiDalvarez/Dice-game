import { Ranking } from "../../domain/Ranking";
import { PlayerService } from ".././PlayerService";
import {
  PlayerMongoDbManager,
  RankingMongoDbManager,
} from "../infrastructure/mongoDbManager";
import { RankingService } from "../application/RankingService";
import config from "../../config/config";
import dataBaseConnection
import { PlayerType } from "../domain/Player";
import { playerSchema } from "../infrastructure/models/mongoDbModel";
import { createDatabase, sequelize } from "../infrastructure/mySQLConnection";
import { PlayerSQL } from "../infrastructure/models/mySQLModels/PlayerMySQLModel";
import { GameSQL } from "../infrastructure/models/mySQLModels/GameMySQLModel";


const isMongo = config.NODE_ENV === "mongo"

if(isMongo){
  const mongoPlayerDocument = dataBaseConnection.model<PlayerType>(
    "Player",
    playerSchema
  );
  const playerMongoManager = new PlayerMongoDbManager();
  const playerService = new PlayerService(playerMongoManager);
  const rankingMongoDbManager = new RankingMongoDbManager(ranking);
  const rankingService = new RankingService(rankingMongoDbManager);
  return {
      playerMongoManager,
      playerService,
      rankingService
  };
}else{
  await dataBaseConnection.query("CREATE DATABASE IF NOT EXISTS `dice-game`");
  PlayerSQL.hasMany(GameSQL, {
    foreignKey: "player_id",
    as: "games",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    await sequelize.sync();

  });
  
  };







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
	runMongo()
} else {
  sqlDependencies;
}
