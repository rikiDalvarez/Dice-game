import request from "supertest";
import { Application, applicationStart } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";
import { getGames } from "../auxilaryFunctionsForTests/getPlayers";
import config from "../../config/config";

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

  test("Should delete all games:", async () => {
    await addGame(requestUri, token, playerId);
    await addGame(requestUri, token, playerId);
    const games = await getGames(requestUri, token, playerId)
    expect(games.length).toBe(2);

    await request(requestUri)
      .delete(`/api/games/${playerId}`)
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const gamesAfterDelete =  await getGames(requestUri, token, playerId)
    expect(gamesAfterDelete.length).toBe(0);
  });
  
  test("Should throw an error if can't delete games:", async () => {
    const fakePlayerId = "64df74ce45186255a45885c2"
    await addGame(requestUri, token, playerId);
    await addGame(requestUri, token, playerId);
    const games = await getGames(requestUri, token, playerId)
    expect(games.length).toBe(2);

    await request(requestUri)
      .delete(`/api/games/${fakePlayerId}`)
      .set("Authorization", token)
      .expect(404)
      .expect("Content-Type", /application\/json/);

    const gamesAfterDelete = await getGames(requestUri, token, playerId)
    expect(gamesAfterDelete.length).toBe(2);
  });

  afterAll(async () => {
    app.stop()
   
  });
});
