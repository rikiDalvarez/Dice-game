import supertest from "supertest";
import { server } from "../src/Server";
import { app } from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { PlayerDocument } from "../src/Server";
import { dbConnection } from "../src/Server";

const api = supertest(app);

async function createUser(name: string, password: string, email: string) {
  const response = await api
    .post("/api/players/")
    .send({ name: name, password: password, email: email });
  return response;
}

describe("REST CHANGE NAME TEST", () => {
  beforeEach(async () => {
    await PlayerDocument.deleteMany({});
  });

  test("Should change name:", async () => {
    const response = await createUser("mafalda", "password", "mafalda@op.pl");
    const userId = response.body.Player_id;
    const newName = "riki";
    const responseAfterChange = await api
      .put(`/api//players/${userId}`)
      .send({ name: newName })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(responseAfterChange).toBeTruthy;
    const user = await PlayerDocument.findOne({ _id: userId });
    if (user) {
      expect(user.name).toBe(newName);
    }
  });

  test("Should return confict if new name is used by other player:", async () => {
    await createUser("mafalda", "password", "mafalda@op.pl");

    const response = await createUser("riki", "password", "riki@op.pl");
    const userId = response.body.Player_id;
    const newName = "mafalda";
    await api
      .put(`/api//players/${userId}`)
      .send({ name: newName })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return NotFoundError if wrong id:", async () => {
    await createUser("mafalda", "password", "mafalda@op.pl");
    await createUser("riki", "password", "riki@op.pl");
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
