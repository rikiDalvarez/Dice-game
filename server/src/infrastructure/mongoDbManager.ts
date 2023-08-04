import { Player } from "../domain/Player";
import { PlayerInterface } from "../application/PlayerInterface";
import { PlayerDocument } from "../mongoDbModel";
import { User } from "../domain/User";
import { ObjectId } from "mongoose";


export class PlayerMongoDbManager implements PlayerInterface {
  async createPlayer(player: User): Promise<Player> {
    const newPlayer = new Player(player.email, player.password, [],  player.name)
    const playerFromDB = await PlayerDocument.create(newPlayer);
    console.log(playerFromDB)
    console.log(newPlayer)
    console.log('type', typeof(playerFromDB))

    const playerForGame = new Player(playerFromDB.email, playerFromDB.password, playerFromDB.games, playerFromDB.name);

    console.log(playerForGame)
    // const id = playerFromDB._id;
    // newPlayer.setId(id);
    // console.log(newPlayer)
    ///return newPlayer;


    PlayerDocument.create(newPlayer).then((data)=> data)
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
    if (playerDocument) return true;
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
