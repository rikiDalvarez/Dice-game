import "dotenv/config";
import config from "../config/config";
import express, { NextFunction, Request, Response } from "express";
import router from "./routes";
import { connectDatabase } from "./infrastructure/mongoDbConnection";
import cors from "cors";
import { errorHandler } from "./errorHandler";


export const app = express();
connectDatabase(config.MONGO_URI, config.DATABASE);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.use((error:Error, _request: Request, response:Response, next:NextFunction) => {
  errorHandler(error, response, next)
}
  
);
