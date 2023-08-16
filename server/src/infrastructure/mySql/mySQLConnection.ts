import { Sequelize } from "sequelize";
import "dotenv/config";
import { createConnection } from "mysql2/promise";
import config from "../../../config/config";

export const createSQLDatabase = async () => {
  const connection = await createConnection({
    host: config.HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
  });
  try {
    await connection.query("CREATE DATABASE IF NOT EXISTS `dice-game`");
    console.log('Database "dice-game" created successfully.');
  } catch (error) {
    console.error("Unable to create database:", error);
    throw error;
  } finally {
    connection.end();
  }
};

export const createSQLConnection = () => {
  try {
    const connection = new Sequelize(
      config.DATABASE,
      config.MYSQL_USER,
      config.MYSQL_PASSWORD,
      {
        host: config.HOST,
        dialect: "mysql",
      }
    );
    console.log("Connected to SQL DB");
    return connection;
  } catch (err) {
    console.log("DB conection error");
    throw err;
  }
};

export const testSQLConnection = async (connection: Sequelize) => {
  try {
    await connection.authenticate();
    console.log(
      "Connection to MySQL database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to MySQL database:", error);
    throw error;
  }
};
