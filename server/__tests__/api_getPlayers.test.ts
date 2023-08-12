import supertest from "supertest";
import { server } from "../src/Server";
import { app } from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import {} from "../src/infrastructure/mongoDbConnection";
import { mongoDbConnection as dbConnection } from "../src/Server";
import { mongoPlayerDocument as PlayerDocument } from "../src/Server";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";

const api = supertest(app);

describe("REST GET PLAYERS TEST", () => {
  beforeEach(async () => {
    await PlayerDocument.deleteMany({});
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

    console.log(response.body.playerList[0].name);
    expect(response.body.playerList.length).toBe(4);
    for (let i = 0; i < 10; i++) {
      const value = response.body.playerList[0].name;
      expect(value).toBe(names[0]);
    }
  });

 

  afterAll((done) => {
    dbConnection.close();
    server.close();
    done();
  });
});
