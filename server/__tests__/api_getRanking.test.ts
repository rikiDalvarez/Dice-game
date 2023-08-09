import supertest from "supertest";
import {server} from "../src/Server"
import { app} from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import {  } from "../src/infrastructure/mongoDbConnection";
import { PlayerDocument } from "../src/Server";
import { dbConnection } from "../src/Server";

//startServer()
const api = supertest(app);


async function addGame(playerId:string){
  await api
  .post(`/api/games/${playerId}`)
}

async function getWinner(){
  const response= await api
  .get(`/api/ranking/winner`)
  return response.body
}

async function getLoser(){
  const response =  await api
  .get(`/api/ranking/loser`)
  return response.body
}




async function createUser(password:string, email:string, name:string, ) {
  const response = await api
    .post("/api/players/")
    .send({ name: name, password: password, email:email });
    console.log('response', response.body)
  return response
}


describe("REST GET RANKING TEST", () => {
 
  beforeEach(async () => {
   await PlayerDocument.deleteMany({})
    
  });


  test("Should return ranking list:", async () => {
    const response1 = await createUser('password', 'mafalda@op.pl','mafalda')
    const playerId1 = response1.body.Player_id
    const response2 = await createUser('password', 'ricky@op.pl','ricky')
    const playerId2 = response2.body.Player_id
    const response3 = await createUser('password', 'milo@op.pl','milo')
    const playerId3 = response3.body.Player_id
    for (let i=0; i<50; i++){
      await addGame(playerId1)
      await addGame(playerId2)
      await addGame(playerId3)
    }
   
    const response =  await api
    .get(`/api/ranking`)
const rankingList = response.body.ranking
const average = response.body.average
     const loser = await getLoser()
     const winner = await getWinner()
  if (winner.length ==1 ){
    expect(rankingList[0]).toStrictEqual(winner[0])
  }
  if (loser.length ==1 ){
    expect(rankingList[2]).toStrictEqual(loser[0])
  }
  
  const calculatedAverage = Number(((rankingList[0].successRate + rankingList[1].successRate + rankingList[2].successRate)/3).toFixed(2))
  expect(calculatedAverage).toBe(Number(average.toFixed((2))))  

});


  
  afterAll((done) => { 
    
    dbConnection.close();
    server.close()
done()
});

});
