import request from "supertest";
import { Game } from "../../src/domain/Game";
import { PlayerDetailsType } from "../../src/domain/PlayerList";

export async function getPlayers(requestUri:string, token:string){
  const response =  await request(requestUri)
  .get(`/api/players`)
  .set("Authorization", token)
  if (response.status != 200) {
    throw new Error("failed to retrieve players")
  }
  console.log('PPPP', response.body.playerList)
  return response.body.playerList;
}

export async function getPlayer(requestUri: string, token: string, playerId: string) {
  const response = await getPlayers(requestUri, token) 
  const players = response as PlayerDetailsType[];
  const playesWithId = players.filter((p) => p.id === playerId)
  if (playesWithId.length > 1) {
    throw new Error("multiple players with same id")
  }
  return playesWithId[0]  
}

export async function getGames(requestUri:string, token:string, playerId: string){
  const response =  await request(requestUri)
  .get(`/api/games/${playerId}`)
  .set("Authorization", token)
  if (response.status != 200) {
    throw new Error("failed to retrieve player games")
  }
  return response.body as Game[];
}