import request from "supertest";
import { Application,  applicationStart } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";
import config from "../../config/config";
import { constants } from "../auxilaryFunctionsForTests/constants";

const requestUri = `http://localhost:${config.PORT}`


describe("API ADD GAME TEST", () => {
  let app: Application
  let token: string;
  let playerId: string;
  beforeAll(async() =>{
    app = await applicationStart()   
  }
  );
  beforeEach(async () => {
    await cleanupDatabase(app.connection)

    const response = await createUser(
      requestUri,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    playerId = response.body.Player_id;
    token = await loginUser(requestUri, "mafalda@op.pl", "password");
  });

  test("Should return list of games", async () => {
    await addGame(requestUri, token, playerId);
    await addGame(requestUri, token, playerId);
    const games = await request(requestUri)
      .get(`/api/games/${playerId}`)
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(games.body.length).toBe(2);
  });


  test("Should throw an error if player doesn't exists", async () => {
    const fakePlayerId = constants(app.connection).id
    await addGame(requestUri, token, playerId);
    await addGame(requestUri, token, playerId);
    const games = await request(requestUri)
      .get(`/api/games/${fakePlayerId}`)
      .set("Authorization", token)
      .expect(404)
      .expect("Content-Type", /application\/json/);
    expect(games.body.length).toBe(undefined);
  });


  afterAll(async () => {
    app.stop()
   
  });
});
