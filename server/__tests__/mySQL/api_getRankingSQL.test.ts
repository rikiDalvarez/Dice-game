import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { addGame } from "../auxilaryFunctionsForTests/addGame";
import { getLoser } from "../auxilaryFunctionsForTests/getLoser";
import { getWinner } from "../auxilaryFunctionsForTests/getWinner";
import { PlayerSQL } from "../../src/infrastructure/models/mySQLModels/PlayerMySQLModel";
import { GameSQL } from "../../src/infrastructure/models/mySQLModels/GameMySQLModel";
import { sequelize } from "../../src/application/dependencias";
import {PlayerType } from "../../src/domain/Player";

const api = supertest(app);

describe("REST GET RANKING TEST", () => {
 
  beforeEach(async () => {
    await PlayerSQL.destroy({
      where: {}
    })
    await GameSQL.destroy({
      where: {}
    })
  })

  test("Should return ranking list:", async () => {
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


    
    const response4 = await createUser(api, "password", "eric@op.pl");
    const playerId4= response4.body.Player_id;
    const tokenPlayer4 = await loginUser(api, "eric@op.pl", "password");


    for (let i = 0; i < 25; i++) {
      await addGame(api, tokenPlayer1, playerId1);
      await addGame(api, tokenPlayer2, playerId2);
      await addGame(api, tokenPlayer3, playerId3);
      await addGame(api, tokenPlayer4, playerId4);

    }
    


    const response = await api.get(`/api/ranking`).set("Authorization", tokenPlayer1);
    const rankingList = response.body.ranking;
    const average = response.body.average;
    const losers = await getLoser(api, tokenPlayer1);
    const winners = await getWinner(api, tokenPlayer1);
   
    
      const winnerNumbers = winners.length
      const sortedWinnersFromRanking = rankingList.slice(0,winnerNumbers).sort((a:PlayerType,b:PlayerType) => a.name.localeCompare(b.name))
      const sortedWinners = winners.sort((a:PlayerType,b:PlayerType) => a.name.localeCompare(b.name))
      expect(sortedWinnersFromRanking).toStrictEqual(sortedWinners);

      const loserNumbers = losers.length
      const sortedLosersFromRanking = rankingList.slice(-loserNumbers).sort((a:PlayerType,b:PlayerType) => a.name.localeCompare(b.name))
      const sortedLosers = losers.sort((a:PlayerType,b:PlayerType) => a.name.localeCompare(b.name))
      expect(sortedLosersFromRanking).toStrictEqual(sortedLosers);


    const calculatedAverage = Number(
      (
        (rankingList[0].successRate +
          rankingList[1].successRate +
          rankingList[2].successRate+
          rankingList[3].successRate) /
        4
      ).toFixed(2)
    );
    expect(calculatedAverage).toBe(average);
  });

  afterAll((done) => {
    sequelize.close();
    server.close();
    done();
  });
});
