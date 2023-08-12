import supertest from "supertest";
import { server } from "../src/Server";
import { app } from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import {} from "../src/infrastructure/mongoDbConnection";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { PlayerSQL } from "../src/infrastructure/models/mySQLModels/PlayerMySQLModel";
import { GameSQL } from "../src/infrastructure/models/mySQLModels/GameMySQLModel";
import {sequelize } from "../src/infrastructure/mySQLConnection";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";

const api = supertest(app);

describe("REST GET PLAYERS TEST", () => {
 

  
  beforeEach(async () => {
    PlayerSQL.destroy({
      where: {}
    })
    GameSQL.destroy({
      where: {}
    })
  });

  test("Should return list of players", async () => {
    const names = ["mafalda", "ricky", "belinda", "kitten"];
    const passwords = ["pass1", "pass2", "pass3", "pass4"];
    const emails = [
      "mafalda@gmail.com",
      "ricky@gmail.com",
      "belinda@getMaxListeners.com",
      "hello@gmail.com",
    ];
    for (let i = 0; i < 10; i++) {
      await createUser(api, passwords[i], emails[i], names[i]);
    }

    const tokenPlayer1 = await loginUser(api, emails[0], passwords[0])
    const response = await api
      .get(`/api/players`)
      .set("Authorization", tokenPlayer1)
      .expect(200)
      .expect("Content-Type", /application\/json/);
   
    expect(response.body.playerList.length).toBe(4);
    for (let i = 0; i < 10; i++) {
     
      const value = [response.body.playerList[0].name, response.body.playerList[1].name, response.body.playerList[2].name,response.body.playerList[3].name]
     
      expect(value.sort()).toStrictEqual(names.sort());
    }
  });


  afterAll((done) => {
    sequelize.close();
    server.close();
    done();
  });
});
