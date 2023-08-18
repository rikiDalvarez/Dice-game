<<<<<<< HEAD:server/__tests__/apiTests/api_postPlayer.test.ts
//import bcrypt from "bcrypt";
import request from "supertest";
import {  Application, start } from "../../src/app";
=======
import { server } from "../../src/Server";
import {
  connection as dbConnection,
  playerService,
} from "../../src/application/dependencias";
import bcrypt from "bcrypt";
import supertest from "supertest";
import { app } from "../../src/app";
>>>>>>> refs/remotes/origin/development:server/__tests__/mongoDB/api_postPlayer.test.ts
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
<<<<<<< HEAD:server/__tests__/apiTests/api_postPlayer.test.ts
    await cleanupDatabase(app.connection)
=======
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await dbConnection.dropCollection("players");
    await dbConnection.createCollection("players");
  });
>>>>>>> refs/remotes/origin/development:server/__tests__/mongoDB/api_postPlayer.test.ts

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
<<<<<<< HEAD:server/__tests__/apiTests/api_postPlayer.test.ts
    const token  = await loginUser(requestUri, 'mafalda@op.pl', 'first password')
    const playerDetails = await getPlayer(requestUri, token, playerId)
    console.log('DETT',playerDetails)
=======
    console.log(playerId);
    const playerDetails = await playerService.findPlayer(playerId);
    console.log(playerDetails);
>>>>>>> refs/remotes/origin/development:server/__tests__/mongoDB/api_postPlayer.test.ts

    
//TODO: thinh about better test
    if (playerDetails) {
<<<<<<< HEAD:server/__tests__/apiTests/api_postPlayer.test.ts
      const { name, id, rating} = playerDetails;
      //const passwordMatch = bcrypt.compare('first password', password)
      expect(id.toString()).toBe(playerId);
=======
      console.log(playerDetails);
      const { name, email, password, games, id, successRate } = playerDetails;
      const passwordMatch = bcrypt.compare("first password", password);
      expect(id).toBe(playerId);
>>>>>>> refs/remotes/origin/development:server/__tests__/mongoDB/api_postPlayer.test.ts
      expect(name).toBe("first user");
      //expect(passwordMatch).toBeTruthy;
      //expect(email).toBe("mafalda@op.pl");
    expect(Number(rating)).toBe(0);
    }
<<<<<<< HEAD:server/__tests__/apiTests/api_postPlayer.test.ts

    
  });

  test("Should create more than one anonim user:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");
    await createUser(requestUri, "second password", "second.anonim@op.pl");
    const token = await loginUser(requestUri, 'first.anonim@op.pl', "first password")
=======
  }, 30000);

  test("Should create more than one anonim user:", async () => {
    await createUser(api, "first password", "first.anonim@op.pl");
    await createUser(api, "second password", "second.anonim@op.pl");
    const token = await loginUser(api, "first.anonim@op.pl", "first password");
>>>>>>> refs/remotes/origin/development:server/__tests__/mongoDB/api_postPlayer.test.ts

    const response = await request(requestUri)
      .get("/api/players")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const listLength = response.body.playerList.length
    expect(listLength).toBe(2);
  }, 30000);

  test("Should create anonim user:", async () => {
<<<<<<< HEAD:server/__tests__/apiTests/api_postPlayer.test.ts
    await createUser(requestUri, "first password", "first.anonim@op.pl");
    const token = await loginUser(requestUri, 'first.anonim@op.pl', "first password")
=======
    await createUser(api, "first password", "first.anonim@op.pl");
    const token = await loginUser(api, "first.anonim@op.pl", "first password");
>>>>>>> refs/remotes/origin/development:server/__tests__/mongoDB/api_postPlayer.test.ts

    const response = await request(requestUri)
      .get("/api/players")
      .set("Authorization", token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const listLength = response.body.playerList.length;
    const name = response.body.playerList[0].name;
    expect(listLength).toBe(1);
    expect(name).toBe("unknown");
  }, 30000);

  test("two anonim should have different emails:", async () => {
<<<<<<< HEAD:server/__tests__/apiTests/api_postPlayer.test.ts
    await createUser(requestUri, "first password", "first.anonim@op.pl");
    const token = await loginUser(requestUri, 'first.anonim@op.pl', "first password")
=======
    await createUser(api, "first password", "first.anonim@op.pl");
    const token = await loginUser(api, "first.anonim@op.pl", "first password");
>>>>>>> refs/remotes/origin/development:server/__tests__/mongoDB/api_postPlayer.test.ts

    await request(requestUri)
      .post("/api/players")
      .set("Authorization", token)
      .send({ password: "second password", email: "first.anonim@op.pl" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should create user if name not passed:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");

    await request(requestUri)
      .post("/api/players")
      .send({ password: "first password", email: "mafalda@op.pl" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should fail if reques body lacks email", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");

    await request(requestUri)
      .post("/api/players/")
      .send({ password: "password", name: "mafalda" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should fail if reques body lacks password:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");

    await request(requestUri)
      .post("/api/players/")
      .send({ email: "mafalda@op.pl", name: "user" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should return confilict if name exist:", async () => {
    await createUser(requestUri, "first password", "first.anonim@op.pl");

    await createUser(requestUri, "password", "mafalda@op.pl", "mafalda");
    await request(requestUri)
      .post("/api/players")
      .send({ password: "password", email: "riki@op.pl", name: "mafalda" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should return confilict if email exist:", async () => {
    await createUser(requestUri, "password", "mafalda@op.pl", "mafalda");
    await request(requestUri)
      .post("/api/players")
      .send({ password: "password", email: "mafalda@op.pl", name: "riki" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("Should return ValidationError if wrong email format:", async () => {
    await createUser(requestUri, "password", "mafalda@op.pl", "mafalda");
    await request(requestUri)
      .post("/api/players")
      .send({ name: "riki", password: "password", email: "mafaldaop.pl" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
<<<<<<< HEAD:server/__tests__/apiTests/api_postPlayer.test.ts
  });
  
=======
  }, 30000);
>>>>>>> refs/remotes/origin/development:server/__tests__/mongoDB/api_postPlayer.test.ts

  afterAll(async () => {
   app.stop();
  });
});
