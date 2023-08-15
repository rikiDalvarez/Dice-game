import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { mongoDbConnection as dbConnection } from "../../src/Server";
import { mongoPlayerDocument as PlayerDocument } from "../../src/application/dependencies/mongoDependecies";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { playerMongoManager } from "../../src/application/dependencies/controllerDependencies";
const api = supertest(app);

describe("API ADD GAME TEST", () => {
  let token: string;
  let playerId: string
  beforeEach(async () => {
    await PlayerDocument.deleteMany({});
    const response = await createUser(
      api,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    playerId = response.body.Player_id
    token = await loginUser(api, 'mafalda@op.pl', 'password')

  });


  test("Should add games to player:", async () => {

    await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    if (!playerMongoManager) {
      throw new Error("playerMongoManager is not defined");
    }
    const playerAfterSecondGame = await playerMongoManager.findPlayer(playerId);
    expect(playerAfterSecondGame.games.length).toBe(10);
  });


  afterAll((done) => {
    dbConnection.close();
    server.close();
    done();
  });
});
