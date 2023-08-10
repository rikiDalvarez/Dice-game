import supertest from "supertest";

export async function getLoser(application:supertest.SuperTest<supertest.Test>){
  const response =  await application
  .get(`/api/ranking/loser`)
  return response.body
}
