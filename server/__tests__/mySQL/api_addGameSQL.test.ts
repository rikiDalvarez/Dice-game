import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { PlayerSQL } from "../../src/infrastructure/models/mySQLModels/PlayerMySQLModel";
import { GameSQL } from "../../src/infrastructure/models/mySQLModels/GameMySQLModel";
import { sequelize } from "../../src/application/dependencias";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
const api = supertest(app);


describe("API ADD GAME TEST", () => {
  let token: string;
  let playerId: string
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
    playerId = response.body.Player_id
    token = await loginUser(api, 'mafalda@op.pl', 'password')

  });

  test("Should add games to player:", async () => {
   
    for (let i=0; i<7; i++ ){
      await api
      .post(`/api/games/${playerId}`)
      .set('Authorization', token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    }
    
    const playerAfterSecondGame = await PlayerSQL.findByPk(playerId, { include: [PlayerSQL.associations.games] });
    const games =  playerAfterSecondGame?.games ||[]
    expect(games?.length).toBe(7);
  });

  
  test("Should actualize succesRate:", async () => {
    for (let i = 0; i < 10; i++) {
       await api
        .post(`/api/games/${playerId}`)
        .set('Authorization', token)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    }
     const playerAfterSecondGame = await PlayerSQL.findByPk(playerId, { include: [PlayerSQL.associations.games] });
    const games = playerAfterSecondGame?.games ||[]
    const gameWin = games.filter((game)=>game.gameWin)
    const successRate = gameWin.length/games.length * 100
    expect(Number(playerAfterSecondGame?.successRate)).toBe(successRate);
   


  });

  test("If player id don't exists throw error:", async () => {
    const nonExistingPlayerId = '987c1361-c396-4294-93bb-71987fa0486d'
   
      const response = await api
        .post(`/api/games/${nonExistingPlayerId}`)
        .set('Authorization', token)
        .expect(404)
        .expect("Content-Type", /application\/json/);
      expect(response.body.error).toBe(undefined)


  });

  afterAll(async () => {
    await sequelize.close();
    server.close();

  });
});
