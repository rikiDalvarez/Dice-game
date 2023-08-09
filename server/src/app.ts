import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import router from "./routes";
import cors from "cors";
import { errorHandler } from "./errorHandler";
import { connectMySQLDatabase } from "./infrastructure/mySQLConnection";

export const app = express();

const mongoDB = true;

const chooseDatabase = async () => {
  if (mongoDB) {
    connectDatabase(config.MONGO_URI, config.DATABASE);
  }
  connectMySQLDatabase()
}

chooseDatabase()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.use((error: Error, _request: Request, response: Response, next: NextFunction) => {
  errorHandler(error, response, next)
}

);
