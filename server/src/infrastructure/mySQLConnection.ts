import { Sequelize } from "sequelize";
import "dotenv/config";
import { createConnection } from "mysql2/promise"

const connectionString = process.env.SQL_URL ?? '';
const database = process.env.SQL_DATABASE;
/*
export const sequelize = new Sequelize(connectionString, {
  dialect: 'mysql',
  database: database,
});
*/
export const createDatabase = async () => {
  const connection = await createConnection(connectionString);
  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS `dice-game`');
    console.log('Database "dice-game" created successfully.');
  } catch (error) {
    console.error('Unable to create database:', error);
    throw error;
  } finally {
    connection.end();
  }
}

export const sequelize = new Sequelize('dice-game', 'root', 'password', {
  host: '127.0.0.1',
  dialect: 'mysql'
})

export const connectMySQLDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection to MySQL database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to MySQL database:', error);
    throw error
  }
}