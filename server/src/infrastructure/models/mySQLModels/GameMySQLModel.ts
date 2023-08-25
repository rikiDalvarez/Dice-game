import { DataTypes, Model, Sequelize } from "sequelize";
import { IGameSQL } from "../../../domain/Game";

export class GameSQL extends Model<IGameSQL>{
  declare id?: string
  declare gameWin: boolean
  declare dice1Value: number
  declare dice2Value: number
  declare player_id: string
}

export function initializeGameTable(sequelize: Sequelize) {
  GameSQL.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
