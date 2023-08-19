import config from "../../config/config";
import { start } from "../../src/app";

const databaseName = config.NODE_ENV==="test"? config.TEST_DATABASE: config.DATABASE


start(config.DATABASE_ENV, databaseName )