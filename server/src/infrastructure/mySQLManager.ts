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
    // playerDocument.base.connection
  }

  createGameDoc(games: Array<GameType>, id: string) {
    return games.map((game) => {
      return {
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
    if (err.errors[0].path === "email") {
      throw new Error("EmailConflictError");
    }
    if (err.errors[0].path === "name") {
      throw new Error("NameConflictError");
    }
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
    //----> if below will be never used. FindAll returns Model[] it can be empty or not.
    //Thus, playerFromDB never will be null or undefined.
    //To translate error from database to custom try-catch block should be used.
    if (!playersFromDB) {
      throw new Error("PlayerNotFound");
    }
    //------<
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
    try {
      await PlayerSQL.update(
        { name: newName },
        {
          where: { id: playerId },
        }
      );
    } catch (err) {
      if (err instanceof ValidationError) {
        this.validationErrorHandler(err);
      }
      throw err;
    }

    const returnPlayer = { id: playerId, name: newName };
    return returnPlayer;
  }

  async addGame(player: Player): Promise<boolean> {
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
      const lastGameResult = player.games[player.games.length - 1].gameWin;
      return lastGameResult;
    } catch (error) {
      console.error("Error in addGame:", error);
      if (transaction) {
        await transaction.rollback();
      }
      throw new Error("transaction failed");
    }
  }

  async deleteAllGames(player: Player): Promise<boolean> {
    const id = player.id;
    const response = await GameSQL.destroy({
      where: {
        player_id: id,
      },
    });
    //----> en este caso podemos pensar si se debe hacer throw Error
    //---->porque cuando 'no deletion' vamos a revolver false, otross errores va a coger nuestro errerHandler

    //----> if below will be never used. Destroy never returns null or undefined.
    //To translate database error could be used try-catch block. But it can be also propagated
    //and catched somwhere down without translation to custom error.
    if (!response) {
      throw new Error("DeletionError");
    }
    //-------<

    const isDeleted = response > 0;
    return isDeleted;
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
    // playerDocument.base.connection
  }

  // así es más fácil
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
    await PlayerSQL.destroy({
      where: {},
    });
    await GameSQL.destroy({
      where: {},
    });

    //----> if below will be never used. Find all alwayr return [], it can be empty or not.
    //To translate database error could be used try-catch block.

    if (!playerRanking) {
      throw new Error("PlayerNotFound");
    }

    //-----<
    const players = playerRanking.map((players) => {
      return new Player(
        players.email,
        players.password,
        players.games!,
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
