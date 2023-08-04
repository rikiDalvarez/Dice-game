import path from "path";
import dotenv from "dotenv";

// Parsing the env file.
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
console.log(path.resolve(process.cwd(), ".env"));
console.log(process.env.DATABASE);
// Interface to load env variables

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  MONGO_URI: string | undefined;
  DATABASE: string | undefined;
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  DATABASE: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    DATABASE: process.env.DATABASE,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    MONGO_URI: process.env.MONGO_URI,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  console.log(config);
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
