import { DataTypes, Model, Sequelize } from "sequelize";
import { IPlayerSQL } from "../../../domain/Player";
import { GameSQL } from "./GameMySQLModel";

export class PlayerSQL extends Model<IPlayerSQL> {
  declare id: string
  declare name: string | null
  declare email: string
  declare password: string
  declare registrationDate: Date
  declare successRate: number
  declare games: GameSQL[]
}

export function initializePlayerTable(sequelize: Sequelize) {

  PlayerSQL.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
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
    }
  },
    {
      sequelize,
      modelName: 'Player',
      tableName: 'players'
    }
  );
}