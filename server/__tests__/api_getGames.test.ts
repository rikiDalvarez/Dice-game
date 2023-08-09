import supertest from "supertest";
import {server} from "../src/Server"

import { app} from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { PlayerDocument } from "../src/Server";
import { dbConnection } from "../src/Server";
//startServer()
const api = supertest(app);

async function addGame(playerId:string){
  await api
  .post(`/api/games/${playerId}`)
}

async function createUser(password:string, email:string, name?:string, ) {
  const response = await api
    .post("/api/players/")
    .send({ name: name, password: password, email:email });
    console.log('response', response.body)
  return response
}


describe("REST GET PLAYERS TEST", () => {
  
  beforeEach(async () => {
   await PlayerDocument.deleteMany({})
    
  });


  test("Should return list of players", async () => {

    const response = await createUser('password', 'mafalda@op.pl','mafalda')
    const playerId = response.body.Player_id
    await addGame(playerId)
    await addGame(playerId)
    const games = await api
      .get(`/api/games/${playerId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

   expect(games.body.length).toBe(2)
   
    
  });

  test("Should return confict if new name is used by other player:", async () => {
    await createUser('password', 'mafalda@op.pl', 'mafalda', )

    const response = await createUser('password', 'riki@op.pl', 'riki', )
    const userId = response.body.Player_id
    const newName = 'mafalda'
    await api
      .put(`/api//players/${userId}`)
      .send({ name: newName})
      .expect(409)
      .expect("Content-Type", /application\/json/);

  });

  test("Should return NotFoundError if wrong id:", async () => {
    await createUser('mafalda', 'password', 'mafalda@op.pl')
    await createUser('riki', 'password', 'riki@op.pl')
    const nonExistingUserId = '00d203afb61233613317249a'
    const newName = 'Jose'
    await api
      .put(`/api//players/${nonExistingUserId}`)
      .send({ name: newName})
      .expect(404)
      .expect("Content-Type", /application\/json/);

  });

  afterAll((done) => { 
    
    dbConnection.close();
    server.close()
done()
});

});
