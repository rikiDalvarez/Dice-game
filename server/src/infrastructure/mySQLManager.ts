import { PlayerInterface } from "../application/PlayerInterface";
import { GameType, IPlayerSQLInput, IPlayerSQLOutput, Player, PlayerType } from "../domain/Player";
import { PlayerSQL } from "./models/mySQLModels/PlayerMySQLModel";
import { User } from "../domain/User";
import { RankingInterface } from "../application/RankingInterface";
import { Ranking } from "../domain/Ranking";
import { PlayerList } from "../domain/PlayerList";
import { mongoPlayerDocument as PlayerDocument } from "../Server";
import { Game } from "../domain/Game";
import { GameSQL } from "./models/mySQLModels/GameMySQLModel";

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

    // I WAS THINKING MAYBE WE CAN CREATE A FUNCTION THAT MAKES A PLAYER/GAME JOIN, NOT SURE WE NEED IT
    // async createPlayerGameJoin(): Promise<Player> {
    //     const playerGamesJoin = await PlayerSQL.findAll({
    //         include: [{
    //             model: GameSQL
    //         }]
    //     })
    //     return playerGamesJoin
    // }

    async findPlayerByEmail(playerEmail: string): Promise<Player> {
        return new Player(
            playerEmail,
            "dummyPlayer",
            [],
            "dummyPlayer",
            "dummyPlayer"
        );
    }

    async createPlayer(player: User): Promise<string> {
        const newPlayer = {
            email: player.email,
            password: player.password,
            name: player.name,
            successRate: 0,
            registrationDate: player.registrationDate,
        };

        const playerFromDB = await PlayerSQL.create(newPlayer);
        return playerFromDB.id;
    }
    // aqui no tiene la propiedad games pero creo que no hace falta porque no ha jugado ningún game

    // needs to be fixed
    async findPlayer(playerID: string): Promise<Player> {
        const playerDetails = await PlayerSQL.findByPk(playerID);
        // en playerDetails tenemos no tenemos Games, hay que hacer JOIN, tengo que mirar bien como hacerlo
        if (playerDetails) {
            const { name, email, password, id } = playerDetails;
            return new Player(email, password, [], name, id);
        } else {
            throw new Error("Player not found");
        }
    }

    // needs to be fixed
    async getPlayerList(): Promise<PlayerList> {
        const playersFromDB = await PlayerSQL.findAll({});
        const players = playersFromDB.map((players) => {
            return new Player(
                players.email,
                players.password,
                [],
                players.name,
                players.id
            );
        });
        return new PlayerList(players);
    }

    // fake function to test
    async changeName(
        playerId: string,
        newName: string
    ): Promise<Partial<Player>> {
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

    // fake function to test
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
                throw new Error(`error: ${err} `);
            });
    }

    // fake function to test
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

    // fake function to test
    async getGames(playerId: string): Promise<GameType[]> {
        const player = await PlayerDocument.findById(playerId);
        return player ? player.games : [];
    }
}

export class RankingMySQLManager implements RankingInterface {
    ranking: Ranking;

    constructor(ranking: Ranking) {
        this.ranking = ranking;
    }

    // fake function to test
    async getMeanSuccesRate(): Promise<number> {
        const meanValue = await PlayerDocument.aggregate([
            {
                $group: {
                    _id: null,
                    meanValue: { $avg: "$successRate" },
                },
            },
        ]);
        return meanValue.length > 0 ? meanValue[0].meanValue : 0;
    }

    // fake function to test
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

    // fake function to test
    async getRankingWithAverage(): Promise<Ranking> {
        this.ranking.rankingList = await this.getPlayersRanking().catch((err) => {
            throw new Error(`error: ${err} `);
        });
        this.ranking.average = await this.getMeanSuccesRate().catch((err) => {
            throw new Error(`error: ${err} `);
        });
        return this.ranking;
    }

    // fake function to test
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

    // fake function to test
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
