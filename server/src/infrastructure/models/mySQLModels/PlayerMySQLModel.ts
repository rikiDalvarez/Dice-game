import { DataTypes, Model, NonAttribute, HasManyGetAssociationsMixin} from "sequelize";
import { sequelize } from "../../mySQLConnection";
import { IPlayerSQL } from "../../../domain/Player";
import { GameSQL } from "./GameMySQLModel";

// import { PlayerType } from "../../../domain/Player";


//type PlayerSQLCreationAttributes = Optional<IPlayerSQL, 'id'>;

export class PlayerSQL extends Model<IPlayerSQL> {

  declare id: string
 declare name: string
  declare email: string
  declare password: string
  declare registrationDate: Date
  declare successRate: number
  declare getGames: HasManyGetAssociationsMixin<GameSQL>
  declare games?: NonAttribute<GameSQL[]>
 
  
}

PlayerSQL.init({
  // MAYBE IS BETTER TO NAME IT _id THEN IT IS LIKE IN MONGODB
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