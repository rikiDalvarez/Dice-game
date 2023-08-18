import request from "supertest";
import { Application, start } from "../../src/app";
import { describe, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";

const requestUri = "http://localhost:8012"
describe("API ADD GAME TEST", () => {
  let app: Application

  beforeAll(async() =>{
    app = await start()   
  }
  );
  beforeEach(async () => {
    await cleanupDatabase(app.connection)

    await createUser(requestUri, "first password", "first.anonim@op.pl");
  });

  it("Should login player", async () => {
    await request(requestUri)
      .post("/api/login")
      .send({ password: "first password", email: "first.anonim@op.pl" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should have an authorization error with wrong password", async () => {
    await request(requestUri)
      .post("/api/login")
      .send({ password: "test", email: "first.anonim@op.pl" })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  it("should have an authorization error with wrong email", async () => {
    await request(requestUri)
      .post("/api/login")
      .send({ password: "first password", email: "test.anonim@op.pl" })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  afterAll(async () => {
    app.stop()
  });
});
