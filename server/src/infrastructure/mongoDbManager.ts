import { Player } from "../domain/Player";
import { PlayerInterface } from "../application/PlayerInterface";
import { PlayerDocument } from "../mongoDbModel";
import { User } from "../domain/User";
import { GameType } from "../domain/Player";
import { RankingInterface } from "../application/RankingInterface";
import { Ranking } from "../domain/Ranking";
export class PlayerMongoDbManager implements PlayerInterface {
  //response returns empty array, should return the player created
  async createPlayer(player: User): Promise<Player> {
    const newPlayer = new Player(
      player.email,
      player.password,
      [],
      player.name
    );
    const playerFromDB = await PlayerDocument.create(newPlayer);
    return playerFromDB;
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
    //check if name is in use
    const nameAlreadyInUse = await PlayerDocument.findOne({ name: newName });
    if (nameAlreadyInUse) {
      //add error handling
      throw new Error("name already in use, please choose another name");
    }
    //find and update
    const player = await PlayerDocument.findByIdAndUpdate(playerId, {
      name: newName,
    });
    if (!player) {
      //add error handler
      throw new Error("player not found");
    }
    return true;
  }

  async addGame(player: Player): Promise<boolean> {
    const id = player.id;
    return PlayerDocument.replaceOne({ _id: { $eq: id } }, player)
      .then((response) => {
        return response.modifiedCount === 1;
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteAllGames(player: Player): Promise<boolean> {
    const id = player.id;
    return PlayerDocument.replaceOne({ _id: { $eq: id } }, player)
      .then((response) => {
        console.log(response);
        return response.modifiedCount === 1;
      })
      .catch((err) => {
        throw err;
      });
  }

  // we don't need to delete players
  async deletePlayer(playerId: string): Promise<boolean> {
    const deletePlayer = await PlayerDocument.findByIdAndDelete(playerId);
    if (deletePlayer) {
      return true;
    }
    return false;
  }

  async getGames(playerId: string): Promise<Array<GameType>> {
    const player = await PlayerDocument.findById(playerId);
    if (!player) {
      return []
    }
    const { games } = player;
    return games;

  }
}

export class RankingMongoDbManager implements RankingInterface {

  async getMeanSuccesRate(): Promise<number | null> {
    const meanValue = await PlayerDocument.aggregate([
      {
        $group: {
          _id: null,
          meanValue: { $avg: '$successRate' }
        }
      }
    ])
    console.log(meanValue[0].meanValue)
    return meanValue.length > 0 ? meanValue[0].meanValue : null
  }

  async getPlayersRanking(): Promise<Ranking> {
    const playerRanking = await PlayerDocument.find().sort({ successRate: -1 });
    const ranking = new Ranking(playerRanking)
    console.log(ranking)
    return ranking;
  }

  async getWinner(): Promise<Player | null> {
    const winner = await PlayerDocument.find().findOne({}, { sort: { succesRate: -1 } })
    if (!winner) {
      return null
    }
    return winner
  }

  async getLooser(): Promise<Player | null> {
    const looser = await PlayerDocument.find().findOne({}, { sort: { succesRate: 1 } })
    if (!looser) {
      return null
    }
    return looser
  }

}