import { DataTypes } from "sequelize";
import { sequelize } from "../../mySQLConnection";
// import { PlayerSQL } from "./PlayerMySQLModel";

export const GameSQL = sequelize.define(
  "GameSQL",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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

// Define the association between PlayerSQL and GameSQL
//PlayerSQL.hasMany(GameSQL, {
// foreignKey: "player_id",
//});
//GameSQL.belongsTo(PlayerSQL, {
//foreignKey: "player_id",
//});
