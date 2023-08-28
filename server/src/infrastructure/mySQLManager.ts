import { PlayerInterface } from "../application/PlayerInterface";
import { GameType, Player } from "../domain/Player";
import { PlayerSQL } from "./models/mySQLModels/PlayerMySQLModel";
import { User } from "../domain/User";
import { RankingInterface } from "../application/RankingInterface";
import { Ranking } from "../domain/Ranking";
import { PlayerList } from "../domain/PlayerList";
import { GameSQL } from "./models/mySQLModels/GameMySQLModel";
import { QueryTypes, Sequelize, ValidationError } from "sequelize";

export class PlayerMySQLManager implements PlayerInterface {
  sequelize: Sequelize;
  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  createGameDoc(games: Array<GameType>, id: string) {
    return games.map((game) => {
      return {
        id: game.id,
        gameWin: game.gameWin,
        dice1Value: game.dice1Value,
        dice2Value: game.dice2Value,
        player_id: id,
      };
    });
  }

  async findPlayerByEmail(playerEmail: string): Promise<Player> {
    const playerDetails = await PlayerSQL.findOne({
      where: { email: playerEmail },
    });
    if (playerDetails) {
      const { name, email, password, id } = playerDetails;
      return new Player(email, password, [], name, id);
    } else {
      throw new Error("EmailNotExists");
    }
  }

  validationErrorHandler(err: ValidationError) {
    err.errors.forEach((error) => {
      if (error.type === "unique violation") {
        if (error.path === "email") {
          throw new Error("EmailConflictError");
        }
        if (error.path === "name") {
          throw new Error("NameConflictError");
        }
      }
      //The last stable version of sequelizer has error. Type returns upper case 'Validation error'
      //but should return lower case 'validation error.'
      if (error.type?.toLowerCase() === "validation error") {
        if (error.path === "email") {
          throw new Error("EmailInvalidError");
        }
      }
    });
    throw err;
  }

  async createPlayer(player: User): Promise<string> {
    const newPlayer = {
      email: player.email,
      password: player.password,
      name: player.name,
      successRate: 0,
      games: [],
      registrationDate: player.registrationDate,
    };
    try {
      const playerFromDB = await PlayerSQL.create(newPlayer);
      return playerFromDB.id;
    } catch (err) {
      if (err instanceof ValidationError) {
        this.validationErrorHandler(err);
      }
      throw err;
    }
  }

  async findPlayer(playerID: string): Promise<Player> {
    const playerDetails = await PlayerSQL.findByPk(playerID, {
      include: [PlayerSQL.associations.games],
    });
    if (!playerDetails) {
      throw new Error("PlayerNotFound");
    }
    const { name, email, password, id } = playerDetails;
    const games = playerDetails.games;
    return new Player(email, password, games, name, id);
  }

  async getPlayerList(): Promise<PlayerList> {
    const playersFromDB = await PlayerSQL.findAll({
      include: [PlayerSQL.associations.games],
    });

    const players = playersFromDB.map((playerFromDB) => {
      const player = new Player(
        playerFromDB.email,
        playerFromDB.password,
        playerFromDB.games,
        playerFromDB.name,
        playerFromDB.id
      );
      player.registrationDate = playerFromDB.registrationDate
      return player
    });

    return new PlayerList(players);
  }

  async changeName(
    playerId: string,
    newName: string
  ): Promise<Partial<Player>> {
    console.log(playerId),
    console.log(newName)
    try {
      const response = await PlayerSQL.update(
        { name: newName },
        {
          where: { id: playerId },
        }
      );
      if (response[0] === 0) {
        throw new Error("changeNameError");
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        this.validationErrorHandler(err);
      }
      throw err;
    }

    const returnPlayer = { id: playerId, name: newName };
    return returnPlayer;
  }

  async addGame(player: Player): Promise<GameType> {
    const transaction = await this.sequelize.transaction();
    try {
      const id = player.id;
      const gameDoc = this.createGameDoc(player.games, id);

      await GameSQL.destroy({
        where: { player_id: id },
        transaction,
      });

      await GameSQL.bulkCreate(gameDoc, { transaction }).catch(() => {
        throw new Error("AddingGameError");
      });

      await PlayerSQL.update(
        { successRate: player.successRate },
        {
          where: {
            id: id,
          },
          transaction,
        }
      );

      await transaction.commit();
      const lastGame = player.games[player.games.length - 1];
      return lastGame;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new Error("TransacrionFailed");
    }
  }

  async deleteAllGames(player: Player): Promise<boolean> {
    const id = player.id;
    const response = await GameSQL.destroy({
      where: {
        player_id: id,
      },
    });

    if (response === 0) {
      throw new Error("DeletionError");
    }
    return true;
  }

  async getGames(playerId: string): Promise<GameType[]> {
    const playerDetails = await PlayerSQL.findByPk(playerId, {
      include: [PlayerSQL.associations.games],
    });

    if (!playerDetails) {
      throw new Error("PlayerNotFound");
    }

    const games = playerDetails.games;
    return games;
  }
}

type SuccesRateObject = {
  successRate: string | null;
};

export class RankingMySQLManager implements RankingInterface {
  ranking: Ranking;

  sequelize: Sequelize;
  constructor(sequelize: Sequelize, ranking: Ranking) {
    (this.sequelize = sequelize), (this.ranking = ranking);
  }

  async getMeanSuccesRate(): Promise<number> {
    const response: SuccesRateObject | null = await this.sequelize.query(
      "SELECT ROUND(AVG(successRate),2) as successRate FROM players",
      { type: QueryTypes.SELECT, plain: true }
    );

    if (!response) {
      throw new Error("GettingMeanValueError");
    }

    const successRate = Number(response.successRate);
    return successRate;
  }

  async getPlayersRanking(): Promise<Player[]> {
    const playerRanking = await PlayerSQL.findAll({
      include: [PlayerSQL.associations.games],
      order: [["successRate", "DESC"]],
    });

    const players = playerRanking.map((playerFromDB) => {
      const player =  new Player(
        playerFromDB.email,
        playerFromDB.password,
        playerFromDB.games!,
        playerFromDB.name,
        playerFromDB.id
      );
      player.registrationDate = playerFromDB.registrationDate
      return player
    });

    return players;
  }

  async getRankingWithAverage(): Promise<Ranking> {
    try {
      this.ranking.rankingList = await this.getPlayersRanking();
      this.ranking.average = await this.getMeanSuccesRate();
      return this.ranking;
    } catch (err) {
      throw new Error(`Error getRankingWithAverage: ${err}`);
    }
  }

  async getWinner(): Promise<Ranking> {
    try {
      let winners;
      const rankingList = await this.getPlayersRanking();
      if (rankingList.length != 0) {
        const winningSuccessRate = rankingList[0].successRate;
        winners = rankingList.filter((player) => {
          return player.successRate === winningSuccessRate;
        });
      }
      this.ranking.winners = winners || [];
      return this.ranking;
    } catch (err) {
      throw new Error(`Error getting winner: ${err}`);
    }
  }

  async getLoser(): Promise<Ranking> {
    try {
      let losers = [];
      const rankingList = await this.getPlayersRanking();

      const minSuccessRate = Math.min(
        ...rankingList.map((player) => {
          return player.successRate;
        })
      );

      losers = rankingList.filter((player) => {
        return player.successRate === minSuccessRate;
      });
      this.ranking.losers = losers;
      return this.ranking;
    } catch (err) {
      throw new Error(`Error getting loser: ${err}`);
    }
  }
}
