import mongoose from "mongoose";

export function connectDatabase(
  url: string,
  dbName: string
): mongoose.Connection {
  try {
    const options = { dbName };
    const connection = mongoose.createConnection(url, options);
    console.log("Connected to the database 🌱");
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}
