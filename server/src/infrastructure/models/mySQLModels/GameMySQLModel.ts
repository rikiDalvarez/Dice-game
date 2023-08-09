import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../mySQLConnection";
import { PlayerSQL } from "./PlayerMySQLModel";

export const Game = sequelize.define(
  "Game",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameWin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    dice1Value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dice2Value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {}
);

// This creates the table if it doesn't exist (and does nothing if it already exists)
// Game.sync()

// foreing keys

PlayerSQL.hasMany(Game, {
  foreignKey: "player_id",
});
Game.belongsTo(PlayerSQL);
