import{ Connection} from "mongoose";
import { Sequelize } from "sequelize";
import { GameSQL } from "../../src/infrastructure/models/mySQLModels/GameMySQLModel";
import { PlayerSQL } from "../../src/infrastructure/models/mySQLModels/PlayerMySQLModel";

export async function cleanupDatabase(connection: Sequelize | Connection) {
  const isSql = connection instanceof Sequelize;
  if (isSql) {
    await PlayerSQL.destroy({
      where: {},
    });
    await GameSQL.destroy({
      where: {},
    });
  } else {
    (await connection.db.collections()).forEach((collection) =>
      collection.deleteMany({})
    );
  }
}
