import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { mongoConnection as dbConnection } from "../../src/infrastructure/dependencias";
import { mongoPlayerDocument as PlayerDocument } from "../../src/infrastructure/dependencias";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";
import { getWinner } from "../auxilaryFunctionsForTests/getWinner";

const api = supertest(app);

describe("REST GET WINNER TEST", () => {
  beforeEach(async () => {
    await PlayerDocument.deleteMany({});
  });

  test("Should return winner", async () => {
    const response1 = await createUser(
      api,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    const playerId1 = response1.body.Player_id;
    const tokenPlayer1 = await loginUser(api, "mafalda@op.pl", "password");

    const response2 = await createUser(api, "password", "ricky@op.pl", "ricky");
    const playerId2 = response2.body.Player_id;
    const tokenPlayer2 = await loginUser(api, "ricky@op.pl", "password");

    const response3 = await createUser(api, "password", "milo@op.pl", "milo");
    const playerId3 = response3.body.Player_id;
    const tokenPlayer3 = await loginUser(api, "milo@op.pl", "password");

    for (let i = 0; i < 25; i++) {
      await addGame(api, tokenPlayer1, playerId1);
      await addGame(api, tokenPlayer2, playerId2);
      await addGame(api, tokenPlayer3, playerId3);
    }

    const response = await api
      .get(`/api/ranking`)
      .set("Authorization", tokenPlayer1);
    const rankingList = response.body.ranking;
    const winner = await getWinner(api, tokenPlayer1);
    if (winner.length === 1) {
      expect(rankingList[0]).toStrictEqual(winner[0]);
    }
  });

  afterAll(async () => {
    await dbConnection.close();
    server.close();
  });
});
