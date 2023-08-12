import supertest from "supertest";
import { server } from "../src/Server";
// import bcrypt from "bcrypt";
import { app } from "../src/app";
import { describe, afterAll, beforeEach } from "@jest/globals";
import { mongoDbConnection as dbConnection } from "../src/Server";
import { mongoPlayerDocument as PlayerDocument } from "../src/Server";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
const api = supertest(app);

describe("API POST PLAYER TEST", () => {
  beforeEach(async () => {
    await PlayerDocument.deleteMany({});
    await createUser(api, "first password", "first.anonim@op.pl");
  });

  it("Should login player", async () => {
    await api
      .post("/api/login")
      .send({ password: "first password", email: "first.anonim@op.pl" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should have an authorization error with wrong password", async () => {
    await api
      .post("/api/login")
      .send({ password: "test", email: "first.anonim@op.pl" })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  it("should have an authorization error with wrong email", async () => {
    await api
      .post("/api/login")
      .send({ password: "first password", email: "test.anonim@op.pl" })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  afterAll((done) => {
    dbConnection.close();
    server.close();
    done();
  });
});
