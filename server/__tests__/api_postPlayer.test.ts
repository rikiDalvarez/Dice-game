import supertest from "supertest";
import {server} from "../src/Server"

import { app}from "../src/app";
import { describe, test, afterAll, beforeEach } from "@jest/globals";
import { PlayerDocument } from "../src/Server";
import { dbConnection } from "../src/Server";
//startServer()
const api = supertest(app);

async function createUser(password:string, email:string, name?:string) {
  const response = await api
    .post("/api/players/")
    .send({ name: name, password: password, email:email });
    console.log('response', response.body)
  return response
}


describe("API POST PLAYER TEST", () => {

  beforeEach(async () => {
   await PlayerDocument.deleteMany({})
    
  });

  test("Should create user:", async () => {
    await api
      .post("/api/players")
      .send({password: "first password", email: "mafalda@op.pl", name: "first user" })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("Should create more than one anonim user:", async () => {
    await createUser("first password", "first.anonim@op.pl" )
    await createUser("second password", "second.anonim@op.pl" )

    const response = await api
      .get("/api/players")
      .expect(200)
      .expect("Content-Type", /application\/json/);
      expect(response.body.playerList.length).toBe(2)
  });

  test("two anonim should have different emails:", async () => {
    await createUser("first password", "first.anonim@op.pl" )

    await api
      .post("/api/players")
      .send({password: "second password", email: "first.anonim@op.pl"})
      .expect(409)
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
      .post("/api/players/")
      .send({password: "password",  name: 'mafalda'})
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });


  test("Should fail if reques body lacks password:", async () => {
    await api
      .post("/api/players/")
      .send({email:"mafalda@op.pl",  name: "user" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return confilict if name exist:", async () => {
    await createUser( 'password', 'mafalda@op.pl', 'mafalda')
    await api
      .post("/api/players")
      .send({password: "password", email: "riki@op.pl", name: "mafalda" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return confilict if email exist:", async () => {
    await createUser('password', 'mafalda@op.pl', 'mafalda')
    await api
      .post("/api/players")
      .send({password: "password", email: "mafalda@op.pl", name: "riki",  })
      .expect(409)
      .expect("Content-Type", /application\/json/);
  });

  test("Should return ValidationError if wrong email format:", async () => {
    await createUser('password', 'mafalda@op.pl', 'mafalda')
    await api
      .post("/api/players")
      .send({ name: "riki", password: "password", email: "mafaldaop.pl" })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  afterAll((done) => { 
    dbConnection.close(); 
    server.close()
done()
  }
    );

});
