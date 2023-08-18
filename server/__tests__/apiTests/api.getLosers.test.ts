import request from "supertest";
import { Application, start } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";
import { getLoser } from "../auxilaryFunctionsForTests/getLoser";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";

const requestUri = "http://localhost:8012"

describe("API ADD GAME TEST", () => {
  let app: Application

  beforeAll(async() =>{
    app = await start()   
  }
  );
  beforeEach(async () => {
    await cleanupDatabase(app.connection)

  })
  test("Should return loser", async () => {
    const player1 = await createUser(
      requestUri,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    const playerId1 = player1.body.Player_id;
    const tokenPlayer1 = await loginUser(requestUri, "mafalda@op.pl", "password");

    const player2 = await createUser(requestUri, "password", "ricky@op.pl", "ricky");
    const playerId2 = player2.body.Player_id;
    const tokenPlayer2 = await loginUser(requestUri, "ricky@op.pl", "password");

    const player3 = await createUser(requestUri, "password", "milo@op.pl", "milo");
    const playerId3 = player3.body.Player_id;
    const tokenPlayer3 = await loginUser(requestUri, "milo@op.pl", "password");

    for (let i = 0; i < 15; i++) {
      await addGame(requestUri, tokenPlayer1, playerId1);
      await addGame(requestUri, tokenPlayer2, playerId2);
      await addGame(requestUri, tokenPlayer3, playerId3);
    }

    const responseList = await request(requestUri)
      .get(`/api/ranking`)
      .set("Authorization", tokenPlayer1);

    const responseListBody = responseList.body.ranking;

    const loser = await getLoser(requestUri, tokenPlayer1);

    expect(loser[0].successRate).toStrictEqual(
      responseListBody[responseListBody.length - 1].successRate
    );
  });

  afterAll(async () => {
    app.stop();

  });
});
