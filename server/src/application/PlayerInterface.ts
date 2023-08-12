import { Player } from "../domain/Player";
import { User } from "../domain/User";
import { GameType } from "../domain/Player";
import { PlayerList } from "../domain/PlayerList";

export interface PlayerInterface {
  createPlayer(playerDetails: User): Promise<string>;
  changeName(playerId: string, newName: string): Promise<Partial<Player>>;
  addGame(playerDetails: Player): Promise<boolean>;
  deleteAllGames(playerDetails: Player): Promise<boolean>;
  findPlayer(playerId: string): Promise<Player>;
  findPlayerByEmail(playerEmail: string): Promise<Player>;
 getPlayerList(): Promise<PlayerList>;
  getGames(playerId: string): Promise<Array<GameType>>;
}
