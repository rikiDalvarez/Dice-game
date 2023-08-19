import request from "supertest";

export async function getWinner(requestUri:string, token:string){
  const response =  await request(requestUri)
  .get(`/api/ranking/winner`).set("Authorization", token)
  return response.body
}
