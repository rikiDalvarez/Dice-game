import "dotenv/config";
import config from "../config/config";
import { app } from "./app";

export const server = app.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}! 🍄 `);
});

