import { Player } from "../domain/Player";
import { PlayerInterface } from "../application/PlayerInterface";
import { PlayerDocument } from "./models/mongoDbModel";
import { User } from "../domain/User";
import { GameType } from "../domain/Player";
import { RankingInterface } from "../application/RankingInterface";
import { Ranking } from "../domain/Ranking";
import { PlayerList } from "../domain/PlayerList";

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
    return player ? true : false;
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

  async getPlayerList(): Promise<PlayerList> {
    const playersFromDB = await PlayerDocument.find({});
    return new PlayerList(playersFromDB);

    //--------------->I have changed this part for that above. We dont have to prepare
    // Player class object since our model expect Player. We can pass it directly to class PlayerList
    //Also find return empty array so we dont need to validate with if in this case
    //I created PlayerDetailsType....
    /*
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
    */
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
        return response.modifiedCount === 1;
      })
      .catch((err) => {
        throw err;
      });
  }

  // we don't need to delete players
  async deletePlayer(playerId: string): Promise<boolean> {
    const deletePlayer = await PlayerDocument.findByIdAndDelete(playerId);
    return deletePlayer ? true : false;
  }

  async getGames(playerId: string): Promise<Array<GameType>> {
    const player = await PlayerDocument.findById(playerId);
    return player ? player.games : [];
  }
}

export class RankingMongoDbManager implements RankingInterface {
  async getMeanSuccesRate(): Promise<number | null> {
    const meanValue = await PlayerDocument.aggregate([
      {
        $group: {
          _id: null,
          meanValue: { $avg: "$successRate" },
        },
      },
    ]);
    return meanValue.length > 0 ? meanValue[0].meanValue : null;
  }

  async getPlayersRanking(): Promise<Ranking> {
    const playerRanking = await PlayerDocument.find().sort({ successRate: -1 });
    return new Ranking(playerRanking);
  }

  async getWinner(): Promise<Player[]> {
    try {
      const winners = await PlayerDocument.aggregate([
        {
          $group: {
            _id: null,
            highestSuccessRate: { $max: "$successRate" },
            players: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            winners: {
              $filter: {
                input: "$players",
                as: "player",
                cond: { $eq: ["$$player.successRate", "$highestSuccessRate"] },
              },
            },
          },
        },
      ]);
      return winners ? winners[0].winners : [];
    } catch (error) {
      console.error("Error getting winners:", error);
      return [];
    }
  }
  async getLoser(): Promise<Player[]> {
    try {
      const losers = await PlayerDocument.aggregate([
        {
          $group: {
            _id: null,
            lowestSuccessRate: { $min: "$successRate" },
            players: { $push: "$$ROOT" },
          },
        },
        {
          $unwind: "$players",
        },
        {
          $match: {
            "players.successRate": "$lowestSuccessRate",
          },
        },
        {
          $group: {
            _id: null,
            losers: { $push: "$players" },
          },
        },
      ]);
      console.log(losers);
      return losers ? losers[0].losers : [];
    } catch (error) {
      console.error("Error getting losers:", error);
      return [];
    }
  }
}

// THIS IS THE WINNER FUNCTION I CHANGED
// async getWinner(): Promise<Player | null> {
//   const winner = await PlayerDocument.find().findOne({}, { sort: { succesRate: -1 } })
//   if (!winner) {
//     return null
//   }
//   return winner
// }

// THIS IS THE LOSER FUNCTION I CHANGED
// async getLooser(): Promise<Player | null> {

//   const looser = await PlayerDocument.find().findOne({}, { sort: { succesRate: 1 } })
//   if (!looser) {
//     return null
//   }
//   return looser
// }
