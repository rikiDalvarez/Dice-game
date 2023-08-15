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

describe("API DELETE GAME TEST", () => {
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

  test("Should delete all games:", async () => {
    await addGame(api, token, playerId);
    await addGame(api, token, playerId);
    const player =  await PlayerSQL.findByPk(playerId, { include: [PlayerSQL.associations.games] })
    const games = player?.games ||[]
    expect(games.length).toBe(2);

    await api
      .delete(`/api/games/${playerId}`)
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const playerAfterDeleteGames = await PlayerSQL.findByPk(playerId, { include: [PlayerSQL.associations.games] });
    const gamesAfterDelete =  playerAfterDeleteGames?.games ||[]
    expect(gamesAfterDelete?.length).toBe(0);
  });
  
  test("Should throw an error if can't delete games:", async () => {
    const fakePlayerId = "fakeid"
    await addGame(api, token, playerId);
    await addGame(api, token, playerId);
    const player =  await PlayerSQL.findByPk(playerId, { include: [PlayerSQL.associations.games] })
    const games = player?.games ||[]
    expect(games?.length).toBe(2);

    await api
      .delete(`/api/games/${fakePlayerId}`)
      .set("Authorization", token)
      .expect(404)
      .expect("Content-Type", /application\/json/);

    const playerAfterDeleteGames = await PlayerSQL.findByPk(playerId, { include: [PlayerSQL.associations.games] });
    const gamesAfterDelete = playerAfterDeleteGames?.games ||[]
    expect(gamesAfterDelete?.length).toBe(2);
  });

  afterAll(async () => {
    await sequelize.close();
    server.close();
   
  });
});
