import supertest from "supertest";

export async function getWinner(application:supertest.SuperTest<supertest.Test>){
  const response =  await application
  .get(`/api/ranking/winner`)
  return response.body
}
