import { Sequelize } from "sequelize";
import "dotenv/config";

const connectionString = process.env.SQL_URL ?? '';
const database = process.env.SQL_DATABASE;

export const sequelize = new Sequelize(connectionString, {
  dialect: 'mysql',
  database: database,
});


export const connectMySQLDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    await sequelize.authenticate()
    console.log('Connection to MySQL database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to MySQL database:', error);
    throw error
  }
}