import supertest from "supertest";

export async function addGame(application: supertest.SuperTest<supertest.Test>, playerId: string) {
    await application.post(`/api/games/${playerId}`);
  }