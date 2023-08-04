import { Player } from "../domain/Player";
import { User } from "../domain/User";



export interface PlayerInterface {
  createPlayer(playerDetails: User): Promise<Player>;
  changeName(playerId: string, newName: string): Promise<boolean>;
  addGame(playerDetails: Player): Promise<boolean>;
  findPlayer(playerEmail:string): Promise<boolean>
  readPlayer(playerId: string): Promise<Player>;
  getPlayerList(): Promise<Array<Player>>;
}

