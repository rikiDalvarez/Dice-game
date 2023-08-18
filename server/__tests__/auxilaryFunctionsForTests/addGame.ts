import request from "supertest";

export async function addGame(requestUri:string, token:string, playerId: string) {
  await request(requestUri).post(`/api/games/${playerId}`).set('Authorization', token);
  }