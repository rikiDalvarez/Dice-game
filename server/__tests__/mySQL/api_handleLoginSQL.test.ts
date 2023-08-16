import supertest from "supertest";
import { app } from "../../src/app";
import { describe, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { PlayerSQL } from "../../src/infrastructure/models/mySQLModels/PlayerMySQLModel";
import { GameSQL } from "../../src/infrastructure/models/mySQLModels/GameMySQLModel";
import { initDatabase, sequelize } from "../../src/application/dependencias";

const api = supertest(app);

describe("API HANDLELOGIN PLAYER TEST", () => {
  beforeAll(async () => await initDatabase())

  beforeEach(async () => {
    await PlayerSQL.destroy({
      where: {},
    });
    await GameSQL.destroy({
      where: {},
    });
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

  afterAll(async () => {
    await sequelize.close();
  });
});
