import { PlayerInterface } from "../application/PlayerInterface";
import { GameType, Player } from "../domain/Player";
import { PlayerSQL } from "./models/mySQLModels/PlayerMySQLModel";
import { User } from "../domain/User";
import { RankingInterface } from "../application/RankingInterface";
import { Ranking } from "../domain/Ranking";
import { PlayerList } from "../domain/PlayerList";
import { GameSQL } from "./models/mySQLModels/GameMySQLModel";
import { Op, QueryTypes} from "sequelize";
import { sequelize } from "../application/dependencias";


export class PlayerMySQLManager implements PlayerInterface {
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

  async createPlayer(player: User): Promise<string> {
    const nameAlreadyInUse = await PlayerSQL.findOne({
      where: {
        [Op.or]: [
          {
            email: player.email,
          },
          {
            [Op.and]: [
              {
                name: {
                  [Op.not]: "unknown",
                },
              },
              {
                name: player.name,
              },
            ],
          },
        ],
      },
    });

    if (nameAlreadyInUse) {
      throw new Error("NameEmailConflictError");
    }

    const newPlayer = {
      email: player.email,
      password: player.password,
      name: player.name,
      successRate: 0,
      games: [],
      registrationDate: player.registrationDate,
    };

    const playerFromDB = await PlayerSQL.create(newPlayer);
    console.log("email", playerFromDB);
    return playerFromDB.id;
  }
  // maybe we don't need it with SQL
  async findPlayer(playerID: string): Promise<Player> {
    const playerDetails = await PlayerSQL.findByPk(playerID, {
      include: [PlayerSQL.associations.games],
    });

    if (playerDetails) {
      const { name, email, password, id } = playerDetails;
      const games = playerDetails.games;
      return new Player(email, password, games, name, id);
    } else {
      throw new Error("PlayerNotFound");
    }
  }

  // I THINK JOIN IS WORKING WELL, althought we really do not need it
  async getPlayerList(): Promise<PlayerList> {
    const playersFromDB = await PlayerSQL.findAll({
      include: [PlayerSQL.associations.games],
    });

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
    const nameAlreadyInUse = await PlayerSQL.findOne({
      where: { name: newName },
    });
    if (nameAlreadyInUse) {
      throw new Error("NameConflictError");
    }
    await PlayerSQL.update(
      { name: newName },
      {
        where: { id: playerId },
      }
    );
    const updatedPlayer = await PlayerSQL.findByPk(playerId);
    if (!updatedPlayer) {
      throw new Error("NotFoundError");
    }
    const returnPlayer = { id: updatedPlayer.id, name: newName };
    return returnPlayer;
  }

  async addGame(player: Player): Promise<boolean> {
    const transaction = await sequelize.transaction();

    try {
      const id = player.id;
      const gameDoc = this.createGameDoc(player.games, id);

      await GameSQL.destroy({
        where: { player_id: id },
        transaction,
      });
      
      await GameSQL.bulkCreate(gameDoc, { transaction }).catch(() => {
        throw new Error("couldn't create games for the player");
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
    } catch (error) {
      console.log("ERRRRRRR", error);
      if (transaction) {
        await transaction.rollback();
      }

      throw new Error("transaction failed");
    }
    const lastGameResult = player.games[player.games.length - 1].gameWin;
    return lastGameResult;
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
    //if (response === 0) {
    //   throw new Error("Error deleting all games")
    //}
    const isDeleted = response > 0;
    return isDeleted;
  }

  async getGames(playerId: string): Promise<GameType[]> {
    const playerDetails = await PlayerSQL.findByPk(playerId, {
      include: [PlayerSQL.associations.games],
    });

    if (playerDetails === null) {
      throw new Error("Player doesn't exist");
    }

    const games = playerDetails.games;
    return games;
  }
}

type SuccesRateObject = {
  successRate: number;
}[];

export class RankingMySQLManager implements RankingInterface {
  ranking: Ranking;

  constructor(ranking: Ranking) {
    this.ranking = ranking;
  }
  // así es más fácil
  async getMeanSuccesRate(): Promise<number> {
    const response: SuccesRateObject = await sequelize.query(
      // TODO: stop hardcoding database name in code!
      "SELECT ROUND(AVG(successRate),2) as successRate FROM players",
      { type: QueryTypes.SELECT }
    );
    const successRate = Number(response[0].successRate);
    return successRate;
  }

  async getPlayersRanking(): Promise<Player[]> {
    const playerRanking = await PlayerSQL.findAll({
      include: [PlayerSQL.associations.games],
      order: [["successRate", "DESC"]],
    });
    if (!playerRanking) {
      throw new Error("no players found");
    }
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
    this.ranking.rankingList = await this.getPlayersRanking().catch((err) => {
      throw err;
    });

    if (!this.ranking.rankingList) {
      console.log("not getting ranking");
    }

    this.ranking.average = await this.getMeanSuccesRate();
    // .catch((err) => {
    //     throw new Error(`error: ${err} `);
    // });

    if (!this.ranking.average) {
      console.log("not getting average");
    }
    return this.ranking;
  }

  async getWinner(): Promise<Ranking> {
    let winners;
    const rankingList = await this.getPlayersRanking();
    console.log("RANKING LIST:", rankingList)
    if (rankingList.length != 0) {
      const winningSuccessRate = rankingList[0].successRate;
      winners = rankingList.filter((player) => {
        return player.successRate === winningSuccessRate;
      });
    }
    console.log("WINNERS:", winners)
   
    this.ranking.winners = winners ||[]
    return this.ranking;
  }

  async getLoser(): Promise<Ranking> {
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
  }
}
