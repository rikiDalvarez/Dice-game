import supertest from "supertest";
import { server } from "../src/Server";

import { app } from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { PlayerDocument } from "../src/Server";
import { playerMongoManager } from "../src/application/controller";
import { dbConnection } from "../src/Server";
//startServer()
const api = supertest(app);

async function addGame(playerId: string) {
  await api.post(`/api/games/${playerId}`);
}

async function createUser(password: string, email: string, name?: string) {
  const response = await api
    .post("/api/players/")
    .send({ name: name, password: password, email: email });
  console.log("response", response.body);
  return response;
}

describe("API DELETE GAME TEST", () => {
  beforeEach(async () => {
    await PlayerDocument.deleteMany({});
  });

  test("Should delete all games:", async () => {
    const response = await createUser(
      "password",
      "mafalda@gmail.com",
      "mafalda"
    );
    const playerId = response.body.Player_id;
    await addGame(playerId);
    await addGame(playerId);
    const player = await playerMongoManager.findPlayer(playerId);
    expect(player.games.length).toBe(2);

    await api
      .delete(`/api/games/${playerId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const playerAfterSecondGame = await playerMongoManager.findPlayer(playerId);
    expect(playerAfterSecondGame.games.length).toBe(0);
  });

  afterAll((done) => {
    dbConnection.close();
    server.close();
    done();
  });
});
