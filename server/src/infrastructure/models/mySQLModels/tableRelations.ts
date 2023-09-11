import Sequelize from "sequelize/types/sequelize";
import { GameSQL } from "./GameMySQLModel";
import { PlayerSQL } from "./PlayerMySQLModel";

export async function createSQLTableRelations(sequelize: Sequelize) {
  PlayerSQL.hasMany(GameSQL, {
    foreignKey: "player_id",
    as: "games",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  });
  await sequelize.sync();
}