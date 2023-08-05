import "dotenv/config";
import config from "../config/config";
import express from "express";
import router from "./routes";
import { connectDatabase } from "./mongoDbConnection";
import cors from 'cors';
// Express

console.log(config.MONGO_URI, config.DATABASE)
const app = express();
connectDatabase(config.MONGO_URI, config.DATABASE)
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}! 🍄 `);
});