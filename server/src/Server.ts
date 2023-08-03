import "dotenv/config";
import config from "../config/config";
import express from "express";
import router from "./routes";
import { connectDatabase } from "./mongoDbConnection";

// Express
const app = express();
connectDatabase(config.MONGO_URI, config.DATABASE)

app.use(express.json());
app.use("/api", router);

app.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}! 🍄 `);
});