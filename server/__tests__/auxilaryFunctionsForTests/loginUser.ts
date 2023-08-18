import request from "supertest";


export async function loginUser(requestUri:string, email:string, password:string) {
    const response = await request(requestUri)
      .post(`/api//login`)
      .send({ email: email, password: password });
    return response.body.token;
  }