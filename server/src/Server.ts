import "dotenv/config";
import config from "../config/config";
import { app } from "./app";
import { connectDatabase } from "./infrastructure/mongoDbConnection";
import { connectMySQLDatabase } from "./infrastructure/mySQLConnection";

export const server = app.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}! 🍄 `);
});

export const mongoDbConnection = connectDatabase(config.MONGO_URI, config.DATABASE);
export const mySQLConnection = connectMySQLDatabase();
