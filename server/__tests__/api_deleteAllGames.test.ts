import supertest from "supertest";
import { server } from "../src/Server";
import { app } from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { PlayerDocument } from "../src/Server";
import { playerMongoManager } from "../src/application/controller";
import { dbConnection } from "../src/Server";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";

const api = supertest(app);

describe("API DELETE GAME TEST", () => {
  beforeEach(async () => {
    await PlayerDocument.deleteMany({});
  });

  test("Should delete all games:", async () => {
    const response = await createUser(
      api,
      "password",
      "mafalda@gmail.com",
      "mafalda"
    );
    const playerId = response.body.Player_id;
    await addGame(api, playerId);
    await addGame(api, playerId);
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
