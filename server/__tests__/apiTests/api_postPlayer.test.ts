import request from "supertest";
import { Application, applicationStart } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { createUser } from "../auxilaryFunctionsForTests/createUser";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";
import { getPlayer } from "../auxilaryFunctionsForTests/getPlayers";
import config from "../../config/config";
import { IPlayerSQL, MongoPlayerType } from "../../src/domain/Player";

const requestUri = `http://localhost:${config.PORT}`;

describe("API CREATE PLAYER TEST", () => {
  let app: Application;

  beforeAll(async () => {
    app = await applicationStart();
  });
  beforeEach(async () => {
    await cleanupDatabase(app.connection);
  });

  test("Should create player:", async () => {
    const response = await request(requestUri)
      .post("/api/players")
      .send({
        password: "first password",
        email: "mafalda@op.pl",
        name: "first user",
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const regDate = new Date().toISOString().slice(0,13)

    const playerId = response.body.Player_id;
    const token = await loginUser(
      requestUri,
      "mafalda@op.pl",
      "first password"
    );
    const playerDetails = await getPlayer(requestUri, token, playerId);

    //TODO: thinh about better test
    if (playerDetails) {
      const { name, id, successRate: rating, email, registrationDate} = playerDetails;
      const registrationDateFromDB = new Date(registrationDate).toISOString().slice(0,13)
      expect(id.toString()).toBe(playerId);
      expect(regDate).toBe(registrationDateFromDB)
      expect(name).toBe("first user");
      expect(email).toBe("mafalda@op.pl");
      expect(Number(rating)).toBe(0);
    }
  });

  test("Should create more than one anonim user:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");
    await createUser(requestUri, "second password", "second.anonim@op.pl");
    const token = await loginUser(
      requestUri,
      "first.anonim@op.pl",
      "first password"
    );
    const response = await request(requestUri)
      .get("/api/players")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const passedDetails = [
      { name: null, email: "first.anonim@op.pl" },
      { name: null, email: "second.anonim@op.pl" },
    ];
    const playerList = response.body.playerList;
    const playerDetails = playerList.map(
      (player: MongoPlayerType | IPlayerSQL) => {
        return { name: player.name, email: player.email };
      }
    );

    const listLength = response.body.playerList.length;
    expect(listLength).toBe(2);
    expect(passedDetails).toEqual(expect.arrayContaining(playerDetails));
  }, 30000);

  test("Should create anonim user:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");
    const token = await loginUser(
      requestUri,
      "first.anonim@op.pl",
      "first password"
    );
    const response = await request(requestUri)
      .get("/api/players")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const listLength = response.body.playerList.length;
    const name = response.body.playerList[0].name;
    expect(listLength).toBe(1);
    expect(name).toBe(null);
  }, 30000);

  test("two anonim should have different emails:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");
    const token = await loginUser(
      requestUri,
      "first.anonim@op.pl",
      "first password"
    );

    await request(requestUri)
      .post("/api/players")
      .set("Authorization", token)
      .send({ password: "second password", email: "first.anonim@op.pl" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should create user if name not passed:", async () => {
    await request(requestUri)
      .post("/api/players")
      .send({ password: "first password", email: "mafalda2@op.pl" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should fail if reques body lacks email", async () => {
    await request(requestUri)
      .post("/api/players/")
      .send({ password: "password", name: "mafalda" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should fail if request body lacks password:", async () => {
    await request(requestUri)
      .post("/api/players/")
      .send({ email: "mafalda@op.pl", name: "user" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should return conflict if name exists:", async () => {
    await createUser(requestUri, "password", "mafalda3@op.pl", "mafalda");
    await request(requestUri)
      .post("/api/players")
      .send({ password: "password", email: "riki@op.pl", name: "mafalda" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should return conflict if email exists:", async () => {
    await createUser(requestUri, "password", "escala@op.pl", "mafalda");
    await request(requestUri)
      .post("/api/players")
      .send({ password: "password", email: "escala@op.pl", name: "riki" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should return ValidationError if wrong email format:", async () => {
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
