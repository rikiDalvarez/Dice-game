import { DataTypes } from "sequelize";
import { sequelize } from "../../mySQLConnection";

export const Player = sequelize.define(
  "Player",
  {
    player_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    successRate: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {}
);

// This creates the table if it doesn't exist (and does nothing if it already exists)
Player.sync();
