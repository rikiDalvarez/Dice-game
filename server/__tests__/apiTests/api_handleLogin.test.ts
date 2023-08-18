import request from "supertest";
import { Application, start } from "../../src/app";
import { describe, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";
import config from "../../config/config";

const requestUri = `http://localhost:${config.PORT}`

describe("API ADD GAME TEST", () => {
  let app: Application

  beforeAll(async() =>{
    app = await start()   
  }
  );
  beforeEach(async () => {
<<<<<<< HEAD:server/__tests__/apiTests/api_handleLogin.test.ts
    await cleanupDatabase(app.connection)

    await createUser(requestUri, "first password", "first.anonim@op.pl");
=======
    await dbConnection.dropCollection("players");
    await createUser(api, "first password", "first.anonim@op.pl");
>>>>>>> refs/remotes/origin/development:server/__tests__/mongoDB/api_handleLogin.test.ts
  });

  it("Should login player", async () => {
    await request(requestUri)
      .post("/api/login")
      .send({ password: "first password", email: "first.anonim@op.pl" })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  it("should have an authorization error with wrong password", async () => {
    await request(requestUri)
      .post("/api/login")
      .send({ password: "test", email: "first.anonim@op.pl" })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  it("should have an authorization error with wrong email", async () => {
    await request(requestUri)
      .post("/api/login")
      .send({ password: "first password", email: "test.anonim@op.pl" })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  afterAll(async () => {
    app.stop()
  });
});
