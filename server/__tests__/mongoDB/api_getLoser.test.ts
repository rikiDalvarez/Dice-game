import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { mongoDbConnection as dbConnection } from "../../src/application/dependencies/mongoDependecies";
import { mongoPlayerDocument as PlayerDocument } from "../../src/application/dependencies/mongoDependecies";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";
import { getLoser } from "../auxilaryFunctionsForTests/getLoser";

const api = supertest(app);

describe("REST GET LOSER TEST", () => {
 
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

    const response = await api.get(`/api/ranking`).set("Authorization", tokenPlayer1);
    const rankingList = response.body.ranking;
    const loser = await getLoser(api, tokenPlayer1);
    if (loser.length == 1) {
      expect(rankingList[2]).toStrictEqual(loser[0]);
    }
  });

  afterAll((done) => {
    dbConnection.close();
    server.close();
    done();
  });
});
