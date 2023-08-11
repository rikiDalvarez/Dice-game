import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../mySQLConnection";
import { IGameSQL, IGameSQLInput } from "../../../domain/Game";
// import { PlayerSQL } from "./PlayerMySQLModel";

export class GameSQL extends Model<IGameSQL, IGameSQLInput> implements IGameSQL {
  public id!: string
  // we need to add player_id, otherwise we cannot connected to the PlayerSQL.id
  public player_id!: string
  public gameWin!: boolean
  public dice1Value!: number
  public dice2Value!: number

}

sequelize.define(
  "GameSQL",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // we need to add player_id, otherwise we cannot connected to the PlayerSQL.id
    player_id: {
      type: DataTypes.UUID,
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

// Define the association between PlayerSQL and GameSQL
//PlayerSQL.hasMany(GameSQL, {
// foreignKey: "player_id",
//});
//GameSQL.belongsTo(PlayerSQL, {
//foreignKey: "player_id",
//});
