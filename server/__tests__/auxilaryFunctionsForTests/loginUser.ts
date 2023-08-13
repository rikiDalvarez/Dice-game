import supertest from "supertest";


export async function loginUser(application:supertest.SuperTest<supertest.Test>, email:string, password:string) {
    const response = await application
      .post(`/api//login`)
      .send({ email: email, password: password });
    return response.body.token;
  }