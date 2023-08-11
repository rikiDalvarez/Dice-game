import supertest from "supertest";
import { server } from "../src/Server";
import { app } from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import {} from "../src/infrastructure/mongoDbConnection";
import { mongoDbConnection as dbConnection } from "../src/Server";
import { mongoPlayerDocument as PlayerDocument } from "../src/Server";
import { createUser } from "../auxilaryFunctionsForTests/createUser";

const api = supertest(app);

describe("REST GET PLAYERS TEST", () => {
  beforeEach(async () => {
    await PlayerDocument.deleteMany({});
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

    console.log(response.body.playerList[0].name);
    expect(response.body.playerList.length).toBe(4);
    for (let i = 0; i < 10; i++) {
      const value = response.body.playerList[0].name;
      expect(value).toBe(names[0]);
    }
  });

  test("Should return NotFoundError if wrong id:", async () => {
    await createUser(api, "password", "mafalda@op.pl", "mafalda");
    await createUser(api, "password", "riki@op.pl", "riki");
    const nonExistingUserId = "00d203afb61233613317249a";
    const newName = "Jose";
    await api
      .put(`/api//players/${nonExistingUserId}`)
      .send({ name: newName })
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });

  afterAll((done) => {
    dbConnection.close();
    server.close();
    done();
  });
});
