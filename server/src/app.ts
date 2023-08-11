import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import router from "./routes";
import cors from "cors";
import { errorHandler } from "./errorHandler";
import { postPlayer, handleLogin } from "./application/controller";
import auth from "./infrastructure/middleware/auth";
// import { connectMySQLDatabase } from "./infrastructure/mySQLConnection";
// import { connectDatabase } from "./infrastructure/mongoDbConnection";
// import { config } from "dotenv";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/players", postPlayer);
app.post("/login", handleLogin);

app.use("/api", auth, router);

app.use(
  (error: Error, _request: Request, response: Response, next: NextFunction) => {
    errorHandler(error, response, next);
  }
);
