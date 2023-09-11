import{ Connection} from "mongoose";
import { Sequelize } from "sequelize";


export function constants(connection: Sequelize | Connection) {
    const isSql = connection instanceof Sequelize;
    let id:string
    if (isSql) {
       id = "0879bcb5-e357-4b58-bf19-f9df237753ac"
    } else {
       id = "507f191e810c19729de860ea"
    }
    return {id}
  }