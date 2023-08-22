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
  private playerDocument: Model<PlayerType>;
  constructor(playerDocument: Model<PlayerType>) {
    this.playerDocument = playerDocument;
    // playerDocument.base.connection
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

  async nameAndEmailCheck(player: User): Promise<boolean> {
    const existingPlayer = await this.playerDocument.findOne({
      $or: [
        { email: player.email },
        {
          $and: [{ name: { $ne: "unknown" } }, { name: player.name }],
        },
      ],
    });
    if (existingPlayer) {
      if (existingPlayer.email === player.email) {
        throw new Error("EmailConflictError");
      }
      if (
        existingPlayer.name === player.name &&
        existingPlayer.name != "unknown"
      ) {
        throw new Error("NameConflictError");
      }
    }
    return false;
  }

  async createPlayer(player: User): Promise<string> {
    await this.nameAndEmailCheck(player);

    const newPlayer = {
      email: player.email,
      password: player.password,
      name: player.name,
      games: [],
      successRate: 0,
      registrationDate: player.registrationDate,
    };
    const playerFromDB = await this.playerDocument.create(newPlayer);

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
    const playerDetails = await this.playerDocument.findOne({
      email: playerEmail,
    });
    if (!playerDetails) {
      throw new Error("EmailNotExists");
    }
    const { name, email, password, games, id } = playerDetails;
    return new Player(email, password, games, name, id);
  }

  async getPlayerList(): Promise<PlayerList> {
    const playersFromDB = await this.playerDocument.find({});

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
    const nameAlreadyInUse = await this.playerDocument.findOne({
      name: newName,
    });
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
    );

    if (!response) {
      throw new Error("DeletionError");
    }
    const isDeleted = response.modifiedCount === 1;
    return isDeleted;
  }

  async getGames(playerId: string): Promise<Array<GameType>> {
    const player = await this.playerDocument.findById(playerId);
    if (!player) {
      throw new Error("PlayerNotFound");
    }
    return player ? player.games : [];
  }
}

export class RankingMongoDbManager implements RankingInterface {
  ranking: Ranking;
  private playerDocument: Model<PlayerType>;
  constructor(playerDocument: Model<PlayerType>, ranking: Ranking) {
    this.playerDocument = playerDocument;
    this.ranking = ranking;
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

    return meanValue.length > 0 ? meanValue[0].meanValue : 0;
  }

  async getPlayersRanking(): Promise<Player[]> {
    const playerRanking = await this.playerDocument
      .find()
      .sort({ successRate: -1 });

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
    try {
      this.ranking.rankingList = await this.getPlayersRanking();
      this.ranking.average = await this.getMeanSuccesRate();
      return this.ranking;
    } catch (err) {
      throw new Error("GetRankingWithAverageError");
    }
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
      if (groupedPlayers.length > 0) {
        const winnersDoc = groupedPlayers[0].wholeDocument;
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
      }
      return this.ranking;
    } catch (err) {
      throw new Error(`GettingWinnerError`);
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
      if (groupedPlayers.length > 0) {
        const losersDoc = groupedPlayers[0].wholeDocument;
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
      }
      return this.ranking;
    } catch (err) {
      throw new Error(`GettingLoserError`);
    }
  }
}
