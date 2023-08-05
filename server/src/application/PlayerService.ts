import { Player } from "../domain/Player";
import { User } from "../domain/User";
import { PlayerInterface } from "./PlayerInterface";
import { GameType } from "../domain/Player";

export class PlayerService {
  playerInterface: PlayerInterface;
  constructor(playerInterface: PlayerInterface) {
    this.playerInterface = playerInterface;
  }

  createPlayer(playerDetails: User): Promise<Player> {
    return this.playerInterface.createPlayer(playerDetails);
  }

  changeName(playerId: string, newName: string): Promise<boolean> {
    return this.playerInterface.changeName(playerId, newName);
  }

  addGame(playerDetails: Player): Promise<boolean> {
    return this.playerInterface.addGame(playerDetails);
  }

  deleteAllGames(playerDetails: Player): Promise<boolean> {
    return this.playerInterface.deleteAllGames(playerDetails);
  }

  getGames(playerId:string): Promise<Array<Player>>{
    return this.playerInterface.getGames(playerId)
  }

  findPlayer(playerEmail: string): Promise<boolean> {
    return this.playerInterface.findPlayer(playerEmail)
  }

  readPlayer(playerId: string): Promise<Player> {
    return this.playerInterface.readPlayer(playerId);
  }

  getPlayerList(): Promise<Array<Player>> {
    return this.playerInterface.getPlayerList()
  }
}


