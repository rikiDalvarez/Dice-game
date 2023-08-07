import "dotenv/config";
import config from "../config/config";
import { app } from "./app";

export function startServer(){
  app.listen(config.PORT, () => {
    console.log(`Server is listening on port ${config.PORT}! 🍄 `);
  });
}

startServer()