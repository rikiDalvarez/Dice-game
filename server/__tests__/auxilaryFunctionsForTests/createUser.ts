import supertest from "supertest";

export async function createUser(application:supertest.SuperTest<supertest.Test>, password: string, email: string, name?: string) {
    const response = await application
      .post("/api/players/")
      .send({password: password, email: email,  name: name });
    return response;
  }