import { Player } from "../domain/Player";
import { User } from "../domain/User";
import { PlayerInterface } from "./PlayerInterface";
import { GameType } from "../domain/Player";
import { PlayerList } from "../domain/PlayerList";
import { Game } from "../domain/Game";
import { Dice } from "../domain/Dice";

const dice = new Dice();

export class PlayerService {
  playerInterface: PlayerInterface;
  constructor(playerInterface: PlayerInterface) {
    this.playerInterface = playerInterface;
  }

  createPlayer(playerDetails: User): Promise<string> {
    return this.playerInterface.createPlayer(playerDetails);
  }

  changeName(playerId: string, newName: string): Promise<boolean> {
    return this.playerInterface.changeName(playerId, newName);
  }

  async addGame(playerId: string): Promise<boolean> {
    const player = await this.readPlayer(playerId);
    const game = new Game(dice);
    player.addNewGame(game);
    return this.playerInterface.addGame(player)
  }

  deleteAllGames(playerDetails: Player): Promise<boolean> {
    return this.playerInterface.deleteAllGames(playerDetails);
  }

  getGames(playerId:string): Promise<Array<GameType>>{
    return this.playerInterface.getGames(playerId)
  }

  findPlayer(playerEmail: string): Promise<Player> {
    return this.playerInterface.findPlayer(playerEmail)
  }

  getPlayerList(): Promise<PlayerList> {
    return this.playerInterface.getPlayerList()
  }
}


