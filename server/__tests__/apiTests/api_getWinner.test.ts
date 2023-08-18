import request from "supertest";
import { Application, start } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";
import { getWinner } from "../auxilaryFunctionsForTests/getWinner";
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

  
  });
// TODO: fix test
  test("Should return winner", async () => {
    const response1 = await createUser(
      requestUri,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    const playerId1 = response1.body.Player_id;
    const tokenPlayer1 = await loginUser(requestUri, "mafalda@op.pl", "password");

    const response2 = await createUser(requestUri, "password", "ricky@op.pl", "ricky");
    const playerId2 = response2.body.Player_id;
    const tokenPlayer2 = await loginUser(requestUri, "ricky@op.pl", "password");

    const response3 = await createUser(requestUri, "password", "milo@op.pl", "milo");
    const playerId3 = response3.body.Player_id;
    const tokenPlayer3 = await loginUser(requestUri, "milo@op.pl", "password");

    for (let i = 0; i < 25; i++) {
      await addGame(requestUri, tokenPlayer1, playerId1);
      await addGame(requestUri, tokenPlayer2, playerId2);
      await addGame(requestUri, tokenPlayer3, playerId3);
    }


    const response = await request(requestUri).get(`/api/ranking`).set("Authorization", tokenPlayer1);
    const rankingList = response.body.ranking;
    const winner = await getWinner(requestUri, tokenPlayer1);

    if (winner.length === 1) {
      expect(rankingList[0]).toStrictEqual(winner[0]);
    }
  });


  afterAll(async () => {
    app.stop()
  });
});
