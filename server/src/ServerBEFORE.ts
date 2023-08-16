// import "dotenv/config";
// import config from "../config/config";
// import { app } from "./app";
// import { connectDatabase } from "./infrastructure/mongoDbConnection";
// import { PlayerType } from "./domain/Player";
// import { playerSchema } from "./infrastructure/models/mongoDbModel";
// import {
//   connectMySQLDatabase,
//   createDatabase,
//   sequelize,
// } from "./infrastructure/mySQLConnection";
// import { GameSQL } from "./infrastructure/models/mySQLModels/GameMySQLModel";
// import { PlayerSQL } from "./infrastructure/models/mySQLModels/PlayerMySQLModel";
// import { Connection, Model } from "mongoose";

// export const server = app.listen(config.PORT, () => {
//   console.log(`Server is listening on port ${config.PORT}! 🍄 `);
// });

// // export const mongoDbConnection = connectDatabase(config.MONGO_URI, config.DATABASE);

// export const isMongo = config.NODE_ENV === "mongo";
// // export const isMongo = true;

// export let mongoDbConnection: Connection;
// export let mongoPlayerDocument: Model<PlayerType>;

// const chooseDatabase = async () => {
//   if (isMongo) {
//     mongoDbConnection = connectDatabase(config.MONGO_URI, config.DATABASE);
//     mongoPlayerDocument = mongoDbConnection.model<PlayerType>(
//       "Player",
//       playerSchema
//     );

//     return { mongoDbConnection, mongoPlayerDocument };
//   }

//   await createDatabase();
//   await connectMySQLDatabase();
//   PlayerSQL.hasMany(GameSQL, {
//     foreignKey: "player_id",
//     as: "games",
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });

//   await sequelize.sync();
// };

// chooseDatabase();
