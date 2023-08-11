import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../mySQLConnection";
import { IPlayerSQL, IPlayerSQLInput } from "../../../domain/Player";
import { GameSQL } from "./GameMySQLModel";
// import { PlayerType } from "../../../domain/Player";

/*
export class PlayerSQL extends Model<IPlayerSQL, IPlayerSQLInput> implements IPlayerSQL {
  public id!: string
  public name!: string
  public email!: string
  public password!: string
  public registrationDate!: Date
  public successRate!: number
  public games!: Array<GameSQL>
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
  }
},
  { sequelize }
);
*/

export class PlayerSQL extends Model<IPlayerSQL, IPlayerSQLInput> implements IPlayerSQL {
  public id!: string
  public name!: string
  public email!: string
  public password!: string
  public registrationDate!: Date
  public successRate!: number
  public GameSQLs!: Array<GameSQL>
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
      isEmail: true
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
  { sequelize }
);