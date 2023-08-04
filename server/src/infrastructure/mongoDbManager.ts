import { Player } from "../domain/Player";
import { PlayerInterface } from "../application/PlayerInterface";
import { PlayerDocument } from "../mongoDbModel";
import { User } from "../domain/User";
export class PlayerMongoDbManager implements PlayerInterface {
  async createPlayer(player: User): Promise<Player> {
    const newPlayer = new Player(
      player.email,
      player.password,
      [],
      player.name
    );
    const playerFromDB = await PlayerDocument.create(newPlayer);
      return playerFromDB
  }

  async findPlayer(playerID: string): Promise<boolean> {
    const player = await PlayerDocument.findById(playerID);
    if (player) {
      return true;
    }
    return false;
  }

  async readPlayer(playerId: string): Promise<Player> {
    const playerDetails = await PlayerDocument.findById(playerId);
    if (playerDetails) {
      console.log("Player details retrieved:", playerDetails);
      const { name, email, password, games, id } = playerDetails;
      return new Player(email, password, games, name, id);
    } else {
      throw new Error("Player not found");
    }
  }

  async getPlayerList(): Promise<Array<Player>> {
    const playersFromDB = await PlayerDocument.find({});
    if (playersFromDB) {
      return playersFromDB.map((player) => {
        return new Player(
          player.email,
          player.password,
          player.games,
          player.name,
          player.id
        );
      });
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
    // const playerDocument = await PlayerDocument.findById(player.id);
    //if (playerDocument) return true;
    //return false;
    const id = player.id;
    return PlayerDocument.replaceOne({ _id: {$eq:  id} }, player).then((response)=>{
      return response.modifiedCount === 1
      }).catch((err)=> {throw err})
    }

    async deleteAllGames(player: Player): Promise<boolean> {
      // const playerDocument = await PlayerDocument.findById(player.id);
      //if (playerDocument) return true;
      //return false;
      const id = player.id;
      return PlayerDocument.replaceOne({ _id: {$eq:  id} }, player).then((response)=>{
        console.log(response)
        return response.modifiedCount === 1
        }).catch((err)=> {throw err})
      }
  

  async deletePlayer(playerId: string): Promise<boolean> {
    const deletePlayer = await PlayerDocument.findByIdAndDelete(playerId);
    if (deletePlayer) {
      return true;
    }
    return false;
  }
}
