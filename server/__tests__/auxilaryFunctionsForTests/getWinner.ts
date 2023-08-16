import supertest from "supertest";

export async function getWinner(application:supertest.SuperTest<supertest.Test>, token:string){
  const response =  await application
  .get(`/api/ranking/winner`).set("Authorization", token)
  return response.body
}
