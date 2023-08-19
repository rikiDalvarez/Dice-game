import request from "supertest";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { Application, start } from "../../src/app";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";
import { getGames, getPlayer } from "../auxilaryFunctionsForTests/getPlayers";
import config from "../../config/config";

const requestUri = `http://localhost:${config.PORT}`


describe("API ADD GAME TEST", () => {
  let app: Application
  let token: string;
  let playerId: string;
  beforeAll(async() =>{
    app = await start()   
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

  test("Should add games to player:", async () => {
    for (let i = 0; i < 7; i++) {
      await request(requestUri)
        .post(`/api/games/${playerId}`)
        .set("Authorization", token)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    }

    const playerGamesAfterSecondGame = await getGames(requestUri, token, playerId)
    //  await PlayerSQL.findByPk(playerId, {
      // include: [PlayerSQL.associations.games],
    // });
    const games = playerGamesAfterSecondGame
    expect(games.length).toBe(7);
  });

  test("Should actualize succesRate:", async () => {
    for (let i = 0; i < 10; i++) {
      await request(requestUri)
        .post(`/api/games/${playerId}`)
        .set("Authorization", token)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    }
    const playerAfterSecondGame = await getPlayer(requestUri, token, playerId)
    const games = await getGames(requestUri, token, playerId);
    const gameWin = games.filter((game) => game.gameWin);
    const successRate = (gameWin.length / games.length) * 100;
    expect(Number(playerAfterSecondGame.rating)).toBe(successRate);
  });
//TODO------> this test works only for SQL
/*  test("If player id don't exists throw error:", async () => {
    const nonExistingPlayerId = constantsGenerator(app.connection)

    const response = await request(requestUri)
      .post(`/api/games/${nonExistingPlayerId}`)
      .set("Authorization", token)
      .expect(404)
      .expect("Content-Type", /application\/json/);
    expect(response.body.error).toBe(undefined);
  });
*/
  afterAll(async () => {
app.stop()  });
});

