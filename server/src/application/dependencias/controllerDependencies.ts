// import sqlDependencies from "sqlDependencies.ts";
import config from "../../../config/config";
import { Connection, Model } from "mongoose";
import { PlayerType } from "../../domain/Player";
import { connectDatabase } from "../../infrastructure/mongoDbConnection";
import { playerSchema } from "../../infrastructure/models/mongoDbModel";
// import { mongoDependencies } from "./mongoDependecies";

console.log(config.NODE_ENV);

export let mongoDbConnection: Connection;
export let mongoPlayerDocument: Model<PlayerType>;

const connectToMongoDatabase = async () => {
  mongoDbConnection = connectDatabase(config.MONGO_URI, config.DATABASE);
  mongoPlayerDocument = mongoDbConnection.model<PlayerType>(
    "Player",
    playerSchema
  );

  return { mongoDbConnection, mongoPlayerDocument };
};

connectToMongoDatabase();
// if (config.NODE_ENV === "mongo") {
//   conectToMongoDatabase();
//   mongoDependencies();
// } else {
//   console.log("error, entered in else condition should run SQLconnection");
// }

/* 

const chooseDatabase = () => {
if (config.NODE_ENV === "mongo") {
    return mongoDependencies();
  } else {
    return sqlDependencies();
  }
 
}
const services = chooseDatabase();
export const playerService = services.playerService;
export const rankingService = services.rankingService;
export const playerMongoManager = services.playerMongoManager;
 
 */
