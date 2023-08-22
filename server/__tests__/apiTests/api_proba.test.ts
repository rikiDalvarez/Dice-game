import request from "supertest";
import { Application, start } from "../../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { loginUser } from "../auxilaryFunctionsForTests/loginUser";
import { cleanupDatabase } from "../auxilaryFunctionsForTests/cleanup";
import config from "../../config/config";
import { PlayerSQL } from "../../src/infrastructure/models/mySQLModels/PlayerMySQLModel";

const requestUri = `http://localhost:${config.PORT}`

describe("API ADD GAME TEST", () => {
  let app: Application

  beforeAll(async() =>{
    app = await start()   
  }
  );

  beforeEach(async () => {
    await cleanupDatabase(app.connection)

  });



  test("Should return empty", async () => {
const playerID = '951c8b7e-1541-4f64-b46f-94d2c160e9c0'
    const playerDetails = await PlayerSQL.findByPk(playerID, {
      include: [PlayerSQL.associations.games],
    });
   
    expect(playerDetails).toStrictEqual([]);
  });

  afterAll(async () => {
    app.stop()
   
  });
});
