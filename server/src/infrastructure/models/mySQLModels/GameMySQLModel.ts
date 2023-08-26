import { DataTypes, Model, Sequelize } from "sequelize";
import { GameType } from "../../../domain/Player";

export class GameSQL extends Model<GameType>{
  declare id: string
  declare gameWin: boolean
  declare dice1Value: number
  declare dice2Value: number
  declare player_id?: string
}

export function initializeGameTable(sequelize: Sequelize) {
  GameSQL.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      gameWin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      dice1Value: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      dice2Value: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'Game',
      tableName: 'games'
    }
  );
}
