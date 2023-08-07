import path from "path";
import dotenv from "dotenv";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../.env") });
//console.log(path.resolve(process.cwd(), ".env") )

// Interface to load env variables

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  MONGO_URI: string | undefined;
  DATABASE: string | undefined;
  MONGO_URI_TEST:string |undefined
}

interface Config {
  MONGO_URI_TEST:string 
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  DATABASE: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    MONGO_URI_TEST: process.env.MONGO_URI_TEST,
    DATABASE: process.env.DATABASE,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    MONGO_URI: process.env.MONGO_URI,
  };
};

const getSanitizedConfig = (config: ENV): Config => {
  console.log(config);
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;
