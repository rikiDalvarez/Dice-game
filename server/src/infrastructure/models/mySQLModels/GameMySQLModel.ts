import { DataTypes, Model, Sequelize} from "sequelize";
import { IGameSQL} from "../../../domain/Game";
// import { PlayerSQL } from "./PlayerMySQLModel";


export class GameSQL extends Model<IGameSQL>{
  declare id?: string
  declare gameWin: boolean
  declare dice1Value: number
  declare dice2Value: number
  declare player_id:string
}

export function initializeGameTable(sequelize:Sequelize) {


GameSQL.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // we need to add player_id, otherwise we cannot connected to the PlayerSQL.id
    //player_id: {
    //  type: DataTypes.UUID,
     // allowNull: false,
   // },
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
  {
    sequelize,
    modelName: 'Game',
    tableName: 'games'
  }
);
}
// Define the association between PlayerSQL and GameSQL
//PlayerSQL.hasMany(GameSQL, {
// foreignKey: "player_id",
//});
//GameSQL.belongsTo(PlayerSQL, {
//foreignKey: "player_id",
//});
