import { Player } from "../domain/Player";
import { PlayerInterface } from "../application/PlayerInterface";
import { PlayerDocument } from "../mongoDbModel";

export class PlayerMongoDbManager implements PlayerInterface {
  async createPlayer(player: Player): Promise<Player> {
    const newPlayer = PlayerDocument.create(player);
    return newPlayer;
  }

  async findPlayer(playerID: string): Promise<boolean> {
    const player = await PlayerDocument.findById(playerID);
    if (player) {
      return true;
    }
    return false;
  }

  async readPlayer(playerId: string): Promise<Player> {
    const player = await PlayerDocument.findById(playerId);
    if (player) {
      return player;
    } else {
      throw new Error("Player not found");
    }
  }

  async changeName(playerId: string, newName: string): Promise<boolean> {
    const player = await PlayerDocument.findById(playerId);
    if (player) {
      player.name = newName;
      await player.save();
      return true;
    }
    return false;
  }

  async addGame(player: Player): Promise<boolean> {
    const playerDocument = await PlayerDocument.findById(player.id);
    if (playerDocument) {
      playerDocument.games.push(player.games[0]);
      await playerDocument.save();
      return true;
    }
    return false;
  }

  async deletePlayer(playerId: string): Promise<boolean> {
    const deletePlayer = await PlayerDocument.findByIdAndDelete(playerId);
    if (deletePlayer) {
      return true;
    }
    return false;
  }
}
