import request from "supertest";
// import { server } from "../../src/Server";
import { Application, start } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";
import { getPlayer } from "../auxilaryFunctionsForTests/getPlayers";
import config from "../../config/config";

const requestUri = `http://localhost:${config.PORT}`


describe("API ADD GAME TEST", () => {
  let app: Application
  let token: string;
  let playerId: string;
  beforeAll(async() =>{
    app = await start()   
  }
  );
  beforeEach(async () => {
    await cleanupDatabase(app.connection)

    const response = await createUser(
      requestUri,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    playerId = response.body.Player_id
    token = await loginUser(requestUri, 'mafalda@op.pl', 'password' )

 ;
  });

  test("Should change name:", async () => {
    const newName = "riki";
    const responseAfterChange = await request(requestUri)
      .put(`/api//players/${playerId}`)
      .set("Authorization", token)
      .send({ name: newName })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(responseAfterChange).toBeTruthy;
    const user = await getPlayer(requestUri, token, playerId)
    if (user) {
      expect(user.name).toBe(newName);
    }
  }, 30000);

  test("Should return confict if new name is used by other player:", async () => {

    await createUser(requestUri, "password", "riki@op.pl", "riki");
    const newName = "riki";
    await request(requestUri)
      .put(`/api//players/${playerId}`)
      .set('Authorization', token)
      .send({ name: newName })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should return NotFoundError if wrong id:", async () => {
    await createUser(requestUri, "password", "riki@op.pl", "riki");
    const nonExistingUserId = "00d203afb61233613317249a";
    const newName = "Jose";
    await request(requestUri)
      .put(`/api/players/${nonExistingUserId}`)
      .set("Authorization", token)
      .send({ name: newName })
      .expect(500)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  afterAll(async () => {
    app.stop()
   
  });
});
