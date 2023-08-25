import request from "supertest";
import { Application, applicationStart } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";
import config from "../../config/config";

const requestUri = `http://localhost:${config.PORT}`
describe("API ADD GAME TEST", () => {
  let app: Application

  beforeAll(async() =>{
    app = await applicationStart()   
  }
  );

  beforeEach(async () => {
    await cleanupDatabase(app.connection)

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
    for (let i = 0; i < names.length; i++) {
      await createUser(requestUri, passwords[i], emails[i], names[i]);
    }

    const tokenPlayer1 = await loginUser(requestUri, emails[0], passwords[0]);
    const response = await request(requestUri)
      .get(`/api/players`)
      .set("Authorization", tokenPlayer1)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const value = [
      response.body.playerList[0].name,
      response.body.playerList[1].name,
      response.body.playerList[2].name,
      response.body.playerList[3].name,
    ];
    expect(value.sort()).toStrictEqual(names.sort());
  });

  afterAll(async () => {
    app.stop()
   
  });
});
