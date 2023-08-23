import { Sequelize } from "sequelize/types/sequelize";
import config from "../config/config";
import { PlayerType } from "./domain/Player";
import { playerSchema } from "./infrastructure/models/mongoDbModel";
import { initializeGameTable } from "./infrastructure/models/mySQLModels/GameMySQLModel";
import { initializePlayerTable } from "./infrastructure/models/mySQLModels/PlayerMySQLModel";
import { createSQLTableRelations } from "./infrastructure/models/mySQLModels/tableRelations";
import { connectDatabase } from "./infrastructure/mongoDbConnection";
import { createSQLDatabase, createSequelizer } from "./infrastructure/mySQLConnection";
import { Connection, Model } from "mongoose";



export type InitDataBase = {
  connection: Connection | Sequelize;
  document?: Model<PlayerType>;
};

export async function initDataBase(
    databaseType: string,
    databaseName: string
  ): Promise<InitDataBase> {
    if (databaseType === "mongo") {
      const connection = connectDatabase(config.MONGO_URI, databaseName);
      const playerDocument = connection.model<PlayerType>("Player", playerSchema);
      
      return Promise.resolve({
        connection: connection,
        document: playerDocument,
      });
    } else {
      await createSQLDatabase(databaseName, {
        host: config.HOST,
        user: config.MYSQL_USER,
        password: config.MYSQL_PASSWORD,
      });
      const sequelize = createSequelizer(
        databaseName,
        config.MYSQL_USER,
        config.MYSQL_PASSWORD,
        config.HOST
      );
      initializeGameTable(sequelize);
      initializePlayerTable(sequelize);
      await createSQLTableRelations(sequelize);
      return Promise.resolve({connection: sequelize });
    }
  }