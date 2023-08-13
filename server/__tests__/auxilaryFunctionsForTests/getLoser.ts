import supertest from "supertest";

export async function getLoser(application:supertest.SuperTest<supertest.Test>, token:string){
  const response =  await application
  .get(`/api/ranking/loser`).set("Authorization", token)
  return response.body
}
