import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { PlayerSQL } from "../../src/infrastructure/mySql/models/PlayerMySQLModel";
import { GameSQL } from "../../src/infrastructure/mySql/models/GameMySQLModel";
import { sequelize } from "../../src/infrastructure/dependencias";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
const api = supertest(app);
let token: string;
let playerId: string;
describe("REST CHANGE NAME TEST", () => {
  beforeEach(async () => {
    await PlayerSQL.destroy({
      where: {},
    });
    await GameSQL.destroy({
      where: {},
    });

    const response = await createUser(
      api,
      "password",
      "mafalda@op.pl",
      "mafalda"
    );
    playerId = response.body.Player_id;
    token = await loginUser(api, "mafalda@op.pl", "password");
  });

  test("Should change name:", async () => {
    const newName = "riki";
    const responseAfterChange = await api
      .put(`/api//players/${playerId}`)
      .set("Authorization", token)
      .send({ name: newName })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    expect(responseAfterChange).toBeTruthy;
    const user = await PlayerSQL.findByPk(playerId);
    if (user) {
      expect(user.name).toBe(newName);
    }
  });

  test("Should return confict if new name is used by other player:", async () => {
    await createUser(api, "password", "mafalda@op.pl", "mafalda");

    const response = await createUser(api, "password", "riki@op.pl", "riki");
    const userId = response.body.Player_id;
    const newName = "riki";
    await api
      .put(`/api//players/${userId}`)
      .set("Authorization", token)
      .send({ name: newName })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return NotFoundError if wrong id:", async () => {
    await createUser(api, "password", "mafalda@op.pl", "mafalda");
    await createUser(api, "password", "riki@op.pl", "riki");
    const nonExistingUserId = "00d203afb61233613317249a";
    const newName = "Jose";
    await api
      .put(`/api/players/${nonExistingUserId}`)
      .set("Authorization", token)
      .send({ name: newName })
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });

  afterAll(async () => {
    await sequelize.close();
    server.close();
  });
});
