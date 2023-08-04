import { Player } from "../domain/Player";
import { PlayerInterface } from "./PlayerInterface";


export class PlayerService {
  playerInterface: PlayerInterface;
  constructor(playerInterface: PlayerInterface) {
    this.playerInterface = playerInterface;
  }

  createPlayer(playerDetails: Player): Promise<Player> {
    return this.playerInterface.createPlayer(playerDetails);
  }

  changename(playerId: string, newName: string): Promise<boolean> {
    return this.playerInterface.changeName(playerId, newName);
  }

  addGame(playerDetails: Player): Promise<boolean> {
    return this.playerInterface.addGame(playerDetails);
  }

  findPlayer(playerName:string):Promise<boolean>{
    return this.playerInterface.findPlayer(playerName)
  }

  readPlayer(playerId: string): Promise<Player> {
    return this.playerInterface.readPlayer(playerId);
  }
}


