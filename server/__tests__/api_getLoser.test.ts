import supertest from "supertest";
import { server } from "../src/Server";
import { app } from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import {} from "../src/infrastructure/mongoDbConnection";
import { mongoDbConnection as dbConnection } from "../src/Server";
import { mongoPlayerDocument as PlayerDocument } from "../src/Server";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";
import { getLoser } from "../auxilaryFunctionsForTests/getLoser";
//startServer()
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
    const response2 = await createUser(api, "password", "ricky@op.pl", "ricky");
    const playerId2 = response2.body.Player_id;
    const response3 = await createUser(api, "password", "milo@op.pl", "milo");
    const playerId3 = response3.body.Player_id;
    for (let i = 0; i < 50; i++) {
      await addGame(api, playerId1);
      await addGame(api, playerId2);
      await addGame(api, playerId3);
    }

    const response = await api.get(`/api/ranking`);
    const rankingList = response.body.ranking;
    const loser = await getLoser(api);
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
