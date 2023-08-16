import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { connection as dbConnection } from "../../src/application/dependencias";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";


const api = supertest(app);

describe("REST GET PLAYERS TEST", () => {
  let token: string;
  let playerId: string;
  beforeEach(async () => {
    await dbConnection.dropCollection('players')
    const response = await createUser(
      api,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    playerId = response.body.Player_id;
    token = await loginUser(api, "mafalda@op.pl", "password");
  });

  test("Should return list of games", async () => {
    await addGame(api, token, playerId);
    await addGame(api, token, playerId);
    const games = await api
      .get(`/api/games/${playerId}`)
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(games.body.length).toBe(2);
  });


  afterAll((done) => {
    dbConnection.close();
    server.close();
    done();
  });
});
