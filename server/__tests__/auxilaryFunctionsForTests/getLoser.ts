import request from "supertest";

export async function getLoser(requestUri:string, token:string){
  const response =  await request(requestUri)
  .get(`/api/ranking/loser`).set("Authorization", token)
 
  return response.body
}
