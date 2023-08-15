import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { connection as dbConnection, playerService } from "../../src/application/dependencias";
import { mongoPlayerDocument as PlayerDocument } from "../../src/application/dependencias"
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";

const api = supertest(app);

describe("API DELETE GAME TEST", () => {
  let token: string;
  let playerId: string;
  beforeEach(async () => {
    await PlayerDocument.deleteMany({});
    const response = await createUser(
      api,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    playerId = response.body.Player_id;
    token = await loginUser(api, "mafalda@op.pl", "password");
  });

  test("Should delete all games:", async () => {
    await addGame(api, token, playerId);
    await addGame(api, token, playerId);
    if (!playerService) {
      throw new Error("playerMongoManager is not defined");
    }
    const player = await playerService.findPlayer(playerId);
    expect(player.games.length).toBe(2);

    await api
      .delete(`/api/games/${playerId}`)
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

      const playerAfterSecondGame = await playerService.findPlayer(playerId);
      expect(playerAfterSecondGame.games.length).toBe(0);
  });

  afterAll((done) => {
    dbConnection.close();
    server.close();
    done();
  });
});
