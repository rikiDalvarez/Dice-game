import { Player, PlayerType } from "../domain/Player";
import { PlayerInterface } from "../application/PlayerInterface";
// import { UpdateResult } from "mongodb";
//import { mongoPlayerDocument as PlayerDocument } from "../application/dependencias"
import { User } from "../domain/User";
import { GameType } from "../domain/Player";
import { RankingInterface } from "../application/RankingInterface";
import { Ranking } from "../domain/Ranking";
import { PlayerList } from "../domain/PlayerList";
import { Model } from "mongoose";


export class PlayerMongoDbManager implements PlayerInterface {
  private playerDocument: Model<PlayerType>
  constructor(playerDocument: Model<PlayerType>) {
    this.playerDocument = playerDocument
  }
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
    const existingPlayer = await this.playerDocument.findOne({
      $or: [
        { email: player.email },
        {
          $and: [
            { name: { $ne: "unknown" } },
            { name: player.name }],
        },
      ],
    });
    if (existingPlayer) {
      if (existingPlayer.name === player.name) {
        throw new Error("NameConflictError");
      }
      if (existingPlayer.email === player.email) {
        throw new Error("EmailConflictError");
      }
    }
    const newPlayer = {
      email: player.email,
      password: player.password,
      name: player.name,
      games: [],
      successRate: 0,
      registrationDate: player.registrationDate,
    };
    const playerFromDB = await this.playerDocument.create(newPlayer);
    if (!playerFromDB) {
      throw new Error("CreatingPlayerError")
    }
    return playerFromDB.id;
  }

  async findPlayer(playerID: string): Promise<Player> {
    const playerDetails = await this.playerDocument.findById(playerID);
    if (!playerDetails) {
      throw new Error("PlayerNotFound");
    }
    const { name, email, password, games, id } = playerDetails;
    return new Player(email, password, games, name, id);
  }
  async findPlayerByEmail(playerEmail: string): Promise<Player> {
    const playerDetails = await this.playerDocument.findOne({ email: playerEmail });
    if (!playerDetails) {
      throw new Error("EmailNotExists");
    }
    const { name, email, password, games, id } = playerDetails;
    return new Player(email, password, games, name, id);
  }

  async getPlayerList(): Promise<PlayerList | []> {
    const playersFromDB = await this.playerDocument.find({});
    if (!playersFromDB) {
      return []
    }
    const players = playersFromDB.map((players: PlayerType) => {
      return new Player(
        players.email,
        players.password,
        players.games,
        players.name,
        players._id
      );
    });
    return new PlayerList(players);
  }

  async changeName(
    playerId: string,
    newName: string
  ): Promise<Partial<Player>> {
    const nameAlreadyInUse = await this.playerDocument.findOne({ name: newName });
    if (nameAlreadyInUse) {
      throw new Error("NameConflictError");
    }
    const player = await this.playerDocument.findByIdAndUpdate(playerId, {
      name: newName,
    });
    if (!player) {
      throw new Error("PlayerNotFound");
    }
    const returnPlayer = { id: player.id, name: newName };
    return returnPlayer;
  }
  
  // I HAVE CHANGED IT:

  /* async addGame(player: Player): Promise<boolean> {
    const id = player.id;
    return this.playerDocument.replaceOne(
      { _id: { $eq: id } },
      this.createPlayerDoc(player)
    )
      .then((response: UpdateResult) => {
        if (response.modifiedCount === 1) {
          const lastGameResult = player.games[player.games.length - 1].gameWin
          return lastGameResult
        }
        throw new Error("Erorr during deletion")
      })
      .catch((err) => {
        throw err;
        //---> not sure but is it enough just throw err to pass it down???
        //throw new Error(`error: ${err} `);
      });
  } */
  // OS GUSTA ASÍ addGame ?
  async addGame(player: Player): Promise<boolean> {
    const id = player.id;
    const response = await this.playerDocument.replaceOne(
      { _id: { $eq: id } },
      this.createPlayerDoc(player)
    );
    if (response.modifiedCount === 1) {
      const lastGameResult = player.games[player.games.length - 1].gameWin;
      return lastGameResult;
    }
    throw new Error("AddingGameError");
  }

  async deleteAllGames(player: Player): Promise<boolean> {
    const id = player.id;
    const response = await this.playerDocument.replaceOne(
      { _id: { $eq: id } },
      this.createPlayerDoc(player)
    )
    if (!response) {
      throw new Error("DeletionError");
    }
    const isDeleted = response.modifiedCount === 1
    return isDeleted;
  }

  async getGames(playerId: string): Promise<Array<GameType>> {
    const player = await this.playerDocument.findById(playerId);
    if (!player) {
      throw new Error("PlayerNotFound")
    }
    return player ? player.games : [];
  }
}
// SHOULD WE SEPARATE RANKING IN ANOTHER FILE ?
export class RankingMongoDbManager implements RankingInterface {
  ranking: Ranking;
  private playerDocument: Model<PlayerType>
  constructor(playerDocument: Model<PlayerType>, ranking: Ranking) {
    this.playerDocument = playerDocument
    this.ranking = ranking
  }

  async getMeanSuccesRate(): Promise<number> {
    const meanValue = await this.playerDocument.aggregate([
      {
        $group: {
          _id: null,
          meanValue: { $avg: "$successRate" },
        },
      },
    ]);
    if (!meanValue) {
      throw new Error("GettingSuccessRateAvgError")
    }
    return meanValue.length > 0 ? meanValue[0].meanValue : 0;
  }

  async getPlayersRanking(): Promise<Player[]> {
    const playerRanking = await this.playerDocument.find().sort({ successRate: -1 });
    if (!playerRanking) {
      throw new Error("PlayerNotFound");
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
      const groupedPlayers = await this.playerDocument.aggregate([
        {
          $group: {
            _id: "$successRate",
            wholeDocument: { $push: "$$ROOT" },
          },
        },
        { $sort: { _id: -1 } },
      ]);
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
      const groupedPlayers = await this.playerDocument.aggregate([
        {
          $group: {
            _id: "$successRate",
            wholeDocument: { $push: "$$ROOT" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
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
