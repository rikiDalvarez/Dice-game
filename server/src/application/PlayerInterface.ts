import { Player } from "../domain/Player";



export interface PlayerInterface {
  createPlayer(playerDetails: Player): Promise<boolean>;
  changeName(playerId: string, newName: string): Promise<boolean>;
  addGame(playerDetails: Player): Promise<boolean>;
  readPlayer(playerId: string): Promise<Player>;
}

