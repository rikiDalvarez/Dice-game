import { DataTypes } from "sequelize";
import { sequelize } from "../../mySQLConnection";
import { Player } from "./PlayerMySQLModel";

export const Game = sequelize.define(
  "Game",
  {
    game_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    dice2Value: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {}
);

// This creates the table if it doesn't exist (and does nothing if it already exists)
Game.sync();

// foreing keys

Player.hasMany(Game, {
  foreignKey: "player_id",
});
Game.belongsTo(Player);
