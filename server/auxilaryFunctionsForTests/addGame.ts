import supertest from "supertest";

export async function addGame(application: supertest.SuperTest<supertest.Test>, token:string, playerId: string) {
  await application.post(`/api/games/${playerId}`).set('Authorization', token);
  }