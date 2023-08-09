import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../mySQLConnection";
import { PlayerType } from "../../../domain/Player";

export const PlayerSQL = sequelize.define(
  "Player",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {}
);

// This creates the table if it doesn't exist (and does nothing if it already exists)
// PlayerSQL.sync()
