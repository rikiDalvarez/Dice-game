import request from "supertest";
import { Application, applicationStart } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";
import { getLoser } from "../auxilaryFunctionsForTests/getLoser";
import { getWinner } from "../auxilaryFunctionsForTests/getWinner";
import { MongoPlayerType } from "../../src/domain/Player";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";
import config from "../../config/config";

const requestUri = `http://localhost:${config.PORT}`;

function comparer(a: MongoPlayerType, b: MongoPlayerType) {
  {
    if (a.name === null && b.name === null) {
      return 0;
    } else if (a.name === null) {
      return -1;
    } else if (b.name === null) {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  }
}

describe("API ADD GAME TEST", () => {
  let app: Application;

  beforeAll(async () => {
    app = await applicationStart();
  });
  beforeEach(async () => {
    await cleanupDatabase(app.connection);
  });

  test("Should return ranking list:", async () => {
    const response1 = await createUser(
      requestUri,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    const playerId1 = response1.body.Player_id;
    const tokenPlayer1 = await loginUser(
      requestUri,
      "mafalda@op.pl",
      "password"
    );

    const response2 = await createUser(
      requestUri,
      "password",
      "ricky@op.pl",
      "ricky"
    );
    const playerId2 = response2.body.Player_id;
    const tokenPlayer2 = await loginUser(requestUri, "ricky@op.pl", "password");

    const response3 = await createUser(
      requestUri,
      "password",
      "milo@op.pl",
      "milo"
    );
    const playerId3 = response3.body.Player_id;
    const tokenPlayer3 = await loginUser(requestUri, "milo@op.pl", "password");

    const response4 = await createUser(requestUri, "password", "eric@op.pl");
    const playerId4 = response4.body.Player_id;
    const tokenPlayer4 = await loginUser(requestUri, "eric@op.pl", "password");

    for (let i = 0; i < 25; i++) {
      await addGame(requestUri, tokenPlayer1, playerId1);
      await addGame(requestUri, tokenPlayer2, playerId2);
      await addGame(requestUri, tokenPlayer3, playerId3);
      await addGame(requestUri, tokenPlayer4, playerId4);
    }

    const response = await request(requestUri)
      .get(`/api/ranking`)
      .set("Authorization", tokenPlayer1);
    const rankingList = response.body.ranking;
    const average = response.body.average;
    const losers = await getLoser(requestUri, tokenPlayer1);
    const winners = await getWinner(requestUri, tokenPlayer1);
    console.log(winners)
    const winnerNumbers = winners.length;
    const sortedWinnersFromRanking = rankingList
      .slice(0, winnerNumbers)
      .sort(comparer);
    const sortedWinners = winners.sort(comparer);
    
    console.log(sortedWinnersFromRanking);
    console.log(sortedWinners);
    expect(sortedWinnersFromRanking).toStrictEqual(sortedWinners);

    const loserNumbers = losers.length;
    const sortedLosersFromRanking = rankingList
      .slice(-loserNumbers)
      .sort(comparer);
    const sortedLosers = losers.sort(comparer);
    expect(sortedLosersFromRanking).toStrictEqual(sortedLosers);

    const calculatedAverage = Number(
      (
        (rankingList[0].successRate +
          rankingList[1].successRate +
          rankingList[2].successRate +
          rankingList[3].successRate) /
        4
      ).toFixed(2)
    );
    expect(calculatedAverage).toBe(average);
  });

  afterAll(async () => {
    app.stop();
  });
});
