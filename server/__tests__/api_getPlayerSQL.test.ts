import supertest from "supertest";
import { server } from "../src/Server";
import { app } from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import {} from "../src/infrastructure/mongoDbConnection";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { PlayerSQL } from "../src/infrastructure/models/mySQLModels/PlayerMySQLModel";
import { GameSQL } from "../src/infrastructure/models/mySQLModels/GameMySQLModel";
import {sequelize } from "../src/infrastructure/mySQLConnection";

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
    const paswords = ["pass1", "pass2", "pass3", "pass4"];
    const emails = [
      "mafalda@gmail.com",
      "ricky@gmail.com",
      "belinda@getMaxListeners.com",
      "hello@gmail.com",
    ];
    for (let i = 0; i < 10; i++) {
      await createUser(api, paswords[i], emails[i], names[i]);
    }
    const response = await api
      .get(`/api/players`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    console.log(response.body)
    expect(response.body.playerList.length).toBe(4);
    for (let i = 0; i < 10; i++) {
     
      const value = [response.body.playerList[0].name, response.body.playerList[1].name, response.body.playerList[2].name,response.body.playerList[3].name]
      console.log(names.sort())
      expect(value).toEqual(names);
    }
  });


  afterAll((done) => {
    sequelize.close();
    server.close();
    done();
  });
});
