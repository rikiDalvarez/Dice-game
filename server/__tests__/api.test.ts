import supertest from "supertest";
import { app } from "../src/app";
import { describe, expect, test, afterAll, beforeEach } from "@jest/globals";
//import { app } from "../app";
import { connectDatabase } from "../src/mongoDbConnection";
import config from "../config/config";
import { PlayerDocument } from "../src/infrastructure/models/mongoDbModel";
import { startServer } from "../src/Server";

//startServer()
const api = supertest(app);

describe("REST API TEST", () => {
  beforeEach(async () => {
    const a = await PlayerDocument.deleteMany({})
    console.log(a)

  });

 

  test("Should create user:", async () => {
    await api
      .post("/api/players")
      .send({ name: "first user", password: "first password" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

});
