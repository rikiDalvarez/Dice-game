import { Connection } from "mongoose";
import { Sequelize } from "sequelize";

export async function constantsGenerator(connection: Sequelize | Connection) {
    const isSql = connection instanceof Sequelize ;
    if (isSql) {
        return{nonExistingPlayerId: "03ce8b13-537f-4f05-a9e5-d0d87d61660e"}

     
    }
    else {
      return {nonExistingPlayerId: "987c1361-c396-4294-93bb-71987fa0486d"}
    }
  }