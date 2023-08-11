import supertest from "supertest";
import { server } from "../src/Server";
import { app } from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { mongoDbConnection as dbConnection } from "../src/Server";
import { mongoPlayerDocument as PlayerDocument } from "../src/Server";
import { playerMongoManager } from "../src/application/controller";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { PlayerSQL } from "../src/infrastructure/models/mySQLModels/PlayerMySQLModel";
import { GameSQL } from "../src/infrastructure/models/mySQLModels/GameMySQLModel";
import { sequelize } from "../src/infrastructure/mySQLConnection";
const api = supertest(app);


describe("API ADD GAME TEST", () => {
  beforeEach(async () => {
    PlayerSQL.destroy({
      where: {}
    })
    GameSQL.destroy({
      where: {}
    })
  });

  test("Should add games to player:", async () => {
    const response = await createUser(
      api,
      "password",
      "mafalda@gmail.com",
      "mafalda"
    );
    const playerId = response.body.Player_id;

    await api
      .post(`/api/games/${playerId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .post(`/api/games/${playerId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const playerAfterSecondGame = await PlayerSQL.findByPk(playerId, { include: GameSQL });
    expect(playerAfterSecondGame?.Games.length).toBe(2);
  });

  afterAll((done) => {
    sequelize.close();
    server.close();
    done();
  });
});
