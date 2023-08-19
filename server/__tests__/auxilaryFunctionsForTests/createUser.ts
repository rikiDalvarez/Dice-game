import request from "supertest";

export async function createUser(requestUri:string, password: string, email: string, name?: string) {
    const response = await request(requestUri)
      .post("/api/players/")
      .send({password: password, email: email,  name: name });
    return response;
  }