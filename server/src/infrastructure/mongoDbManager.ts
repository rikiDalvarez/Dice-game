import { Player, PlayerType } from "../domain/Player";
import { PlayerInterface } from "../application/PlayerInterface";
import { PlayerDocument } from "./models/mongoDbModel";
import { User } from "../domain/User";
import { GameType } from "../domain/Player";
import { RankingInterface } from "../application/RankingInterface";
import { Ranking } from "../domain/Ranking";
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
      $or: [
        { email: newPlayer.email },
        {
          $and: [{ name: { $ne: "unknown" } }, { name: newPlayer.name }],
        },
      ],
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
      const { name, email, password, games, id } = playerDetails;
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

  async changeName(
    playerId: string,
    newName: string
  ): Promise<Partial<Player>> {
    //check if name is in use
    const nameAlreadyInUse = await PlayerDocument.findOne({ name: newName });
    if (nameAlreadyInUse) {
      throw new Error("NameConflictError");
    }
    const player = await PlayerDocument.findByIdAndUpdate(playerId, {
      name: newName,
    });
    if (!player) {
      throw new Error("NotFoundError");
    }
    const returnPlayer = { id: player.id, name: newName };
    return returnPlayer;
  }

  async addGame(player: Player): Promise<boolean> {
    // hacer PATCH, cambiar solo el game y no reemplazar el player
    // wouldn't it be better to use updateOne and only change games and successRate?
    // same with deleteAllGames()
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
        throw new Error(`error: ${err} `);
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
export class RankingMongoDbManager implements RankingInterface {
  ranking: Ranking;

  constructor(ranking: Ranking) {
    this.ranking = ranking;
  }

  async getMeanSuccesRate(): Promise<number> {
    const meanValue = await PlayerDocument.aggregate([
      {
        $group: {
          _id: null,
          meanValue: { $avg: "$successRate" },
        },
      },
    ]);
    //this.ranking.average = meanValue.length > 0 ? meanValue[0].meanValue : 0;
    //return this.ranking;
    return meanValue.length > 0 ? meanValue[0].meanValue : 0;
  }

  async getPlayersRanking(): Promise<Player[]> {
    const playerRanking = await PlayerDocument.find().sort({ successRate: -1 });
    if (!playerRanking) {
      throw new Error("no players found");
    }
    const players = playerRanking.map((players) => {
      return new Player(
        players.email,
        players.password,
        players.games,
        players.name,
        players.id
      );
    });

    return players;
  }

  async getRankingWithAverage(): Promise<Ranking> {
    this.ranking.rankingList = await this.getPlayersRanking().catch((err) => {
      throw new Error(`error: ${err} `);
    });
    this.ranking.average = await this.getMeanSuccesRate().catch((err) => {
      throw new Error(`error: ${err} `);
    });
    return this.ranking;
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

      //added validation if groupedPlayers is not empty, e.g. when we dont have any player
      const winnersDoc =
        groupedPlayers.length > 0 ? groupedPlayers[0].wholeDocument : [];
      const winners = winnersDoc.map((players: PlayerType) => {
        return new Player(
          players.email,
          players.password,
          players.games,
          players.name,
          players._id.toString()
        );
      });

      this.ranking.winners = winners;
      return this.ranking;
    } catch (error) {
      console.error("Error getting winners:", error);
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

      //added validation if groupedPlayers is not empty, e.g. when we dont have any player
      const losersDoc =
        groupedPlayers.length > 0 ? groupedPlayers[0].wholeDocument : [];
      const losers = losersDoc.map((players: PlayerType) => {
        return new Player(
          players.email,
          players.password,
          players.games,
          players.name,
          players._id.toString()
        );
      });

      this.ranking.losers = losers;
      return this.ranking;
    } catch (error) {
      console.error("Error getting losers:", error);
      throw error;
    }
  }
}
