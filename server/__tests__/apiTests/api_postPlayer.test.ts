//import bcrypt from "bcrypt";
import request from "supertest";
import {  Application, start } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";
import { getPlayer } from "../auxilaryFunctionsForTests/getPlayers";
import config from "../../config/config";

const requestUri = `http://localhost:${config.PORT}`

describe("API ADD GAME TEST", () => {
  let app: Application

  beforeAll(async() =>{
    app = await start()   
  }
  );
  beforeEach(async () => {
    await cleanupDatabase(app.connection)
  })
  test("Should create player:", async () => {    
    await createUser(requestUri, "second password", "second.anonim@op.pl");
    const response = await request(requestUri)
      .post("/api/players")
      .send({
        password: "first password",
        email: "mafalda@op.pl",
        name: "first user",
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const playerId = response.body.Player_id;
    const token  = await loginUser(requestUri, 'mafalda@op.pl', 'first password')
    const playerDetails = await getPlayer(requestUri, token, playerId)

    
//TODO: thinh about better test
    if (playerDetails) {
      const { name, id, rating} = playerDetails;
      //const passwordMatch = bcrypt.compare('first password', password)
      expect(id.toString()).toBe(playerId);
      expect(name).toBe("first user");
      //expect(passwordMatch).toBeTruthy;
      //expect(email).toBe("mafalda@op.pl");
    expect(Number(rating)).toBe(0);
    }

    
  });

  test("Should create more than one anonim user:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");
    await createUser(requestUri, "second password", "second.anonim@op.pl");
    const token = await loginUser(requestUri, 'first.anonim@op.pl', "first password")

    const response = await request(requestUri)
      .get("/api/players")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const listLength = response.body.playerList.length
    expect(listLength).toBe(2);
  });

  test("Should create anonim user:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");
    const token = await loginUser(requestUri, 'first.anonim@op.pl', "first password")

    const response = await request(requestUri)
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
    await createUser(requestUri, "first password", "first.anonim@op.pl");
    const token = await loginUser(requestUri, 'first.anonim@op.pl', "first password")

    await request(requestUri)
      .post("/api/players")
      .set("Authorization", token)
      .send({ password: "second password", email: "first.anonim@op.pl" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should create user if name not passed:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");

    await request(requestUri)
      .post("/api/players")
      .send({ password: "first password", email: "mafalda@op.pl" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("Should fail if reques body lacks email", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");

    await request(requestUri)
      .post("/api/players/")
      .send({ password: "password", name: "mafalda" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("Should fail if reques body lacks password:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");

    await request(requestUri)
      .post("/api/players/")
      .send({ email: "mafalda@op.pl", name: "user" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return confilict if name exist:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");

    await createUser(requestUri, "password", "mafalda@op.pl", "mafalda");
    await request(requestUri)
      .post("/api/players")
      .send({ password: "password", email: "riki@op.pl", name: "mafalda" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return confilict if email exist:", async () => {
    await createUser(requestUri, "password", "mafalda@op.pl", "mafalda");
    await request(requestUri)
      .post("/api/players")
      .send({ password: "password", email: "mafalda@op.pl", name: "riki" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return ValidationError if wrong email format:", async () => {
    await createUser(requestUri, "password", "mafalda@op.pl", "mafalda");
    await request(requestUri)
      .post("/api/players")
      .send({ name: "riki", password: "password", email: "mafaldaop.pl" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
  

  afterAll(async () => {
   app.stop();
  });
});
