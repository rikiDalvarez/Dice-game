import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";
import { getLoser } from "../auxilaryFunctionsForTests/getLoser";
import { PlayerSQL } from "../../src/infrastructure/models/mySQLModels/PlayerMySQLModel";
import { GameSQL } from "../../src/infrastructure/models/mySQLModels/GameMySQLModel";
import { sequelize } from "../../src/application/dependencias";

const api = supertest(app);

describe("API GET LOSERS TEST", () => {
  beforeEach(async () => {
    await PlayerSQL.destroy({
      where: {},
    });
    await GameSQL.destroy({
      where: {},
    });
  });
  test("Should return loser", async () => {
    const player1 = await createUser(
      api,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    const playerId1 = player1.body.Player_id;
    const tokenPlayer1 = await loginUser(api, "mafalda@op.pl", "password");

    const player2 = await createUser(api, "password", "ricky@op.pl", "ricky");
    const playerId2 = player2.body.Player_id;
    const tokenPlayer2 = await loginUser(api, "ricky@op.pl", "password");

    const player3 = await createUser(api, "password", "milo@op.pl", "milo");
    const playerId3 = player3.body.Player_id;
    const tokenPlayer3 = await loginUser(api, "milo@op.pl", "password");

    for (let i = 0; i < 15; i++) {
      await addGame(api, tokenPlayer1, playerId1);
      await addGame(api, tokenPlayer2, playerId2);
      await addGame(api, tokenPlayer3, playerId3);
    }

    const responseList = await api
      .get(`/api/ranking`)
      .set("Authorization", tokenPlayer1);

    const responseListBody = responseList.body.ranking;

    const loser = await getLoser(api, tokenPlayer1);

    expect(loser[0].successRate).toStrictEqual(
      responseListBody[responseListBody.length - 1].successRate
    );
  });

  afterAll(async () => {
    await sequelize.close();
    server.close();
  });
});
