import supertest from "supertest";
import { app } from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { getDatabase } from "../src/mongoDbConnection";
import { PlayerDocument } from "../src/infrastructure/models/mongoDbModel";

//startServer()
const api = supertest(app);


async function createUser(name:string, password:string, email:string) {
  const response = await api
    .post("/api/players/")
    .send({ name: name, password: password, email:email });
    console.log('response', response.body)
  return response
}


describe("REST API TEST", () => {
  beforeEach(async () => {
   await PlayerDocument.deleteMany({})
    
  });

 

  test("Should create user:", async () => {
    await api
      .post("/api/players")
      .send({ name: "first user", password: "first password", email: "mafalda@op.pl" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("Should create user if name not passed:", async () => {
    await api
      .post("/api/players")
      .send({password: "first password", email: "mafalda@op.pl" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("Should fail if reques body lacks email", async () => {
    await api
      .post("/api/v1/users/")
      .send({ name: 'mafalda', password: "password"})
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });


  test("Should fail if reques body lacks password:", async () => {
    
    await api
      .post("/api/v1/users/")
      .send({ name: "user", email:"mafalda@op.pl" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return confilict if name exist:", async () => {
    await createUser('mafalda', 'password', 'mafalda@op.pl')
    await api
      .post("/api/players")
      .send({ name: "mafalda", password: "password", email: "riki@op.pl" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return confilict if email exist:", async () => {
    await createUser('mafalda', 'password', 'mafalda@op.pl')
    await api
      .post("/api/players")
      .send({ name: "riki", password: "password", email: "mafalda@op.pl" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  afterAll(() => { 
    
    const connection = getDatabase()
    connection.close(); });

});
