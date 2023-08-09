import supertest from "supertest";
import {server} from "../src/Server"
import { app} from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import {  } from "../src/infrastructure/mongoDbConnection";
import { PlayerDocument } from "../src/Server";
import { dbConnection } from "../src/Server";

//startServer()
const api = supertest(app);

async function createUser(name:string, password:string, email:string) {
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
    const names = ["mafalda", 'ricky', 'belinda', 'kitten']
    const paswords = ['pass1', 'pass2', 'pass3', 'pass4']
    const emails = ['mafalda@gmail.com', 'ricky@gmail.com', 'belinda@getMaxListeners.com', 'hello@gmail.com']
    for (let i=0; i <10; i++){
      await createUser(names[i], paswords[i], emails[i])
    }
    const response = await api
      .get(`/api/players`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    console.log(response.body.playerList[0].name)
    expect(response.body.playerList.length).toBe(4)
    for (let i=0; i <10; i++){
      const value = response.body.playerList[0].name
      expect(value).toBe(names[0])
    }
    
  });

  test("Should return confict if new name is used by other player:", async () => {
    await createUser('mafalda', 'password', 'mafalda@op.pl')

    const response = await createUser('riki', 'password', 'riki@op.pl')
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
