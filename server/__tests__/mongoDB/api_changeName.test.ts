import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { connection as dbConnection, playerService } from "../../src/application/dependencias";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";

const api = supertest(app);

describe("REST CHANGE NAME TEST", () => {
  let token:string;
let playerId:string
  beforeEach(async () => {
    await dbConnection.dropCollection('players')
    const response = await createUser(
      api,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
playerId = response.body.Player_id
    token = await loginUser(api, 'mafalda@op.pl', 'password' )

  });

  test("Should change name:", async () => {
    
    const newName = "riki";
    const responseAfterChange = await api
      .put(`/api//players/${playerId}`)
      .set('Authorization', token)
      .send({ name: newName })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(responseAfterChange).toBeTruthy;
    const user = await playerService.findPlayer(playerId);
    if (user) {
      expect(user.name).toBe(newName);
    }
  });

  test("Should return confict if new name is used by other player:", async () => {
    const response = await createUser(api, "password", "riki@op.pl", "riki");
    const userId = response.body.Player_id;
    const newName = "riki";
    await api
      .put(`/api//players/${userId}`)
      .set('Authorization', token)
      .send({ name: newName })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return NotFoundError if wrong id:", async () => {
    const nonExistingUserId = "00d203afb61233613317249a";
    const newName = "Jose";
    await api
      .put(`/api/players/${nonExistingUserId}`)
      .set('Authorization', token)
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
