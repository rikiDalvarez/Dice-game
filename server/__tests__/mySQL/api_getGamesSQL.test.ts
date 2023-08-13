import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { PlayerSQL } from "../../src/infrastructure/models/mySQLModels/PlayerMySQLModel";
import { GameSQL } from "../../src/infrastructure/models/mySQLModels/GameMySQLModel";
import { sequelize } from "../../src/infrastructure/mySQLConnection";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";

const api = supertest(app);

describe("REST GET PLAYERS TEST", () => {
  let token: string;
  let playerId: string;
  beforeEach(async () => {
    await PlayerSQL.destroy({
      where: {}
    })
    await GameSQL.destroy({
      where: {}
    })
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

  test("Should throw an error if player doesn't exists", async () => {
    const fakePlayerId = "fakeid"
    await addGame(api, token, playerId);
    await addGame(api, token, playerId);
    const games = await api
      .get(`/api/games/${fakePlayerId}`)
      .set("Authorization", token)
      .expect(500)
      .expect("Content-Type", /application\/json/);
    expect(games.body.length).toBe(undefined);
  });


  afterAll(async () => {
    await sequelize.close();
    server.close();
   
  });
});
