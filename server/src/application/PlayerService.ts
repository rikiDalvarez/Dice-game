 import { Player } from "../domain/Player";
import { User } from "../domain/User";
import { PlayerInterface } from "./PlayerInterface";

export class PlayerService {
  playerInterface: PlayerInterface;
  constructor(playerInterface: PlayerInterface) {
    this.playerInterface = playerInterface;
  }

  createPlayer(playerDetails: User): Promise<Player> {
    return this.playerInterface.createPlayer(playerDetails);
  }

  changename(playerId: string, newName: string): Promise<boolean> {
    return this.playerInterface.changeName(playerId, newName);
  }

  addGame(playerDetails: Player): Promise<boolean> {
    return this.playerInterface.addGame(playerDetails);
  }

  findPlayer(playerEmail:string):Promise<boolean>{
    return this.playerInterface.findPlayer(playerEmail)
  }

  readPlayer(playerId: string): Promise<Player> {
    return this.playerInterface.readPlayer(playerId);
  }
}


