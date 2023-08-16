import "dotenv/config";
import config from "../config/config";
import { app } from "./app";
import { initDatabase } from "./application/dependencias";

initDatabase().then(() =>
  app.listen(config.PORT, () => {
    console.log(`Server is listening on port ${config.PORT}! 🍄 `);
  })
);

// TODO:remove
export const server = {
  close: () => {},
};
