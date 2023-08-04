import { Player } from "../domain/Player";



export interface PlayerInterface {
  createPlayer(playerDetails: Player): Promise<Player>;
  changeName(playerId: string, newName: string): Promise<boolean>;
  addGame(playerDetails: Player): Promise<boolean>;
  findPlayer(playerName:string): Promise<boolean>
  readPlayer(playerId: string): Promise<Player>;
}

