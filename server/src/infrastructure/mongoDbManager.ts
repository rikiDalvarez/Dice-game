import { Player, PlayerType } from "../domain/Player";
import { PlayerInterface } from "../application/PlayerInterface";
import { PlayerDocument } from "./models/mongoDbModel";
import { User } from "../domain/User";
import { GameType } from "../domain/Player";
import { RankingInterface } from "../application/RankingInterface";
import { Ranking} from "../domain/Ranking";
import { PlayerList } from "../domain/PlayerList";

export class PlayerMongoDbManager implements PlayerInterface {
  createPlayerDoc(player: Player) {
    return {
      id: player.id,
      email: player.email,
      password: player.password,
      registrationDate: player.registrationDate,
      games: player.games,
      name: player.name,
      successRate: player.successRate,
    };
  }

  async createPlayer(player: User): Promise<string> {
    const newPlayer = {
      email: player.email,
      password: player.password,
      name: player.name,
      games: [],
      successRate: 0,
      registrationDate: player.registrationDate,
    };

    const nameAlreadyInUse = await PlayerDocument.findOne({
      $or: [{ email: newPlayer.email }, { name: newPlayer.name }],
    });
    if (nameAlreadyInUse) {
      throw new Error("name already in use, please choose another name");
    }
    const playerFromDB = await PlayerDocument.create(newPlayer);
    return playerFromDB.id;
  }

  async findPlayer(playerID: string): Promise<Player> {
    const playerDetails = await PlayerDocument.findById(playerID);
    if (playerDetails) {
      console.log("Player details retrieved:", playerDetails);
      const { name, email, password, games, id } = playerDetails;
      console.log("games", games);
      return new Player(email, password, games, name, id);
    } else {
      throw new Error("Player not found");
    }
  }

  async getPlayerList(): Promise<PlayerList> {
    const playersFromDB = await PlayerDocument.find({});
    const players = playersFromDB.map((players) => {
      return new Player(
        players.email,
        players.password,
        players.games,
        players.name,
        players.id
      );
    });
    return new PlayerList(players);
  }

  async changeName(playerId: string, newName: string): Promise<boolean> {
    //check if name is in use
    const nameAlreadyInUse = await PlayerDocument.findOne({ name: newName });
    if (nameAlreadyInUse) {
      throw new Error("name already in use, please choose another name");
    }
    const player = await PlayerDocument.findByIdAndUpdate(playerId, {
      name: newName,
    });
    if (!player) {
      throw new Error("player not found");
    }
    return true;
  }

  async addGame(player: Player): Promise<boolean> {
    console.log(player);
    const id = player.id;
    return PlayerDocument.replaceOne(
      { _id: { $eq: id } },
      this.createPlayerDoc(player)
    )
      .then((response) => {
        return response.modifiedCount === 1;
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteAllGames(player: Player): Promise<boolean> {
    const id = player.id;
    return PlayerDocument.replaceOne(
      { _id: { $eq: id } },
      this.createPlayerDoc(player)
    )
      .then((response) => {
        return response.modifiedCount === 1;
      })
      .catch((err) => {
        throw err;
      });
  }
  async getGames(playerId: string): Promise<Array<GameType>> {
    const player = await PlayerDocument.findById(playerId);
    return player ? player.games : [];
  }
}
//Better to seperate in another file


const ranking = new Ranking()
export class RankingMongoDbManager implements RankingInterface {
  async getMeanSuccesRate(): Promise<Ranking> {
    const meanValue = await PlayerDocument.aggregate([
      {
        $group: {
          _id: null,
          meanValue: { $avg: "$successRate" },
        },
      },
    ]);

    ranking.average = meanValue.length > 0 ? meanValue[0].meanValue: 0
    return ranking
  }

  async getPlayersRanking(): Promise<Ranking> {
    const playerRanking = await PlayerDocument.find().sort({ successRate: -1 });
    const players = playerRanking.map((players) => {
      return new Player(
        players.email,
        players.password,
        players.games,
        players.name,
        players.id
      );
    });

    ranking.rankingList = players
    return ranking
  }


  async getWinner(): Promise<Ranking> {
    try {
      const groupedPlayers = await PlayerDocument.aggregate([
        {
          $group: {
            _id: "$successRate",
            wholeDocument: { $push: "$$ROOT" },
          },
        },
        { $sort: { _id: -1 } },
      ]);

      //added validation if proupedPlayers is not empty, e.g. when we dont have any player
      const winnersDoc = groupedPlayers.length>0? groupedPlayers[0].wholeDocument: [];
      const winners = winnersDoc.map((players: PlayerType) => {
        return new Player(
          players.email,
          players.password,
          players.games,
          players.name,
          players._id.toString()
        );
      });

      ranking.winners = winners
      return ranking
    } catch (error) {
      console.error("Error getting losers:", error);
      throw error;
    }
  }
  async getLoser(): Promise<Ranking> {
    try {
      const groupedPlayers = await PlayerDocument.aggregate([
        {
          $group: {
            _id: "$successRate",
            wholeDocument: { $push: "$$ROOT" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      
      //added validation if proupedPlayers is not empty, e.g. when we dont have any player
      const losersDoc = groupedPlayers.length> 0 ? groupedPlayers[0].wholeDocument :[];
      const losers = losersDoc.map((players: PlayerType) => {
        return new Player(
          players.email,
          players.password,
          players.games,
          players.name,
          players._id.toString()
        );
      });

      ranking.losers = losers
      return ranking
    } catch (error) {
      console.error("Error getting losers:", error);
      throw error;
    }
  }


}
