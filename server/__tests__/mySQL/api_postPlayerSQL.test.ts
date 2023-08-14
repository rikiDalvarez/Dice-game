import bcrypt from "bcrypt";
import supertest from "supertest";
import { server } from "../../src/Server";
import { app } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { PlayerSQL } from "../../src/infrastructure/models/mySQLModels/PlayerMySQLModel";
import { GameSQL } from "../../src/infrastructure/models/mySQLModels/GameMySQLModel";
import { sequelize } from "../../src/infrastructure/mySQLConnection";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";

const api = supertest(app);

describe("API POST PLAYER TEST", () => {
  beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
   await  PlayerSQL.destroy({
      where: {}
    })
   await GameSQL.destroy({
      where: {}
    })
  });

  test("Should create player:", async () => {
    const response = await api
      .post("/api/players")
      .send({
        password: "first password",
        email: "mafalda@op.pl",
        name: "first user",
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const playerId = response.body.Player_id;
    const playerDetails = await PlayerSQL.findOne({
      where: { id: playerId }
    });

    if (playerDetails) {
      const { name, email, password, id, successRate } = playerDetails;
      const passwordMatch = bcrypt.compare('first password', password)
      expect(id.toString()).toBe(playerId);
      expect(name).toBe("first user");
      expect(passwordMatch).toBeTruthy;
      expect(email).toBe("mafalda@op.pl");
    expect(Number(successRate)).toBe(0);
    }

    
  });

  test("Should create more than one anonim user:", async () => {
    await createUser(api, "first password", "first.anonim@op.pl");
    await createUser(api, "second password", "second.anonim@op.pl");
    const token = await loginUser(api, 'first.anonim@op.pl', "first password")

    const response = await api
      .get("/api/players")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const listLength = response.body.playerList.length
    expect(listLength).toBe(2);
  });

  test("Should create anonim user:", async () => {
    await createUser(api, "first password", "first.anonim@op.pl");
    const token = await loginUser(api, 'first.anonim@op.pl', "first password")

    const response = await api
      .get("/api/players")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const listLength = response.body.playerList.length;
    const name = response.body.playerList[0].name;
    expect(listLength).toBe(1);
    expect(name).toBe("unknown");
  });

  test("two anonim should have different emails:", async () => {
    await createUser(api, "first password", "first.anonim@op.pl");
    const token = await loginUser(api, 'first.anonim@op.pl', "first password")

    await api
      .post("/api/players")
      .set("Authorization", token)
      .send({ password: "second password", email: "first.anonim@op.pl" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should create user if name not passed:", async () => {
    await api
      .post("/api/players")
      .send({ password: "first password", email: "mafalda@op.pl" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("Should fail if reques body lacks email", async () => {
    await api
      .post("/api/players/")
      .send({ password: "password", name: "mafalda" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("Should fail if reques body lacks password:", async () => {
    await api
      .post("/api/players/")
      .send({ email: "mafalda@op.pl", name: "user" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return confilict if name exist:", async () => {
    await createUser(api, "password", "mafalda@op.pl", "mafalda");
    await api
      .post("/api/players")
      .send({ password: "password", email: "riki@op.pl", name: "mafalda" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return confilict if email exist:", async () => {
    await createUser(api, "password", "mafalda@op.pl", "mafalda");
    await api
      .post("/api/players")
      .send({ password: "password", email: "mafalda@op.pl", name: "riki" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return ValidationError if wrong email format:", async () => {
    await createUser(api, "password", "mafalda@op.pl", "mafalda");
    await api
      .post("/api/players")
      .send({ name: "riki", password: "password", email: "mafaldaop.pl" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
  

  afterAll(async () => {
    await sequelize.close();
    server.close();
   
  });
});
