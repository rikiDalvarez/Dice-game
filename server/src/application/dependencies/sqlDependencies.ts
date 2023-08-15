import { Ranking } from "../../domain/Ranking";
import { GameSQL } from "../../infrastructure/models/mySQLModels/GameMySQLModel";
import { PlayerSQL } from "../../infrastructure/models/mySQLModels/PlayerMySQLModel";
import { createDatabase, sequelize } from "../../infrastructure/mySQLConnection";
import { PlayerMySQLManager, RankingMySQLManager } from "../../infrastructure/mySQLManager";
import { PlayerService } from "../PlayerService";
import { RankingService } from "../RankingService";

const ranking = new Ranking();

export const mySQLDependencies = async () => {
    await createDatabase();
    PlayerSQL.hasMany(GameSQL, {
        foreignKey: "player_id",
        as: "games",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    });
    await sequelize.sync();
    const playerMySQLManager = new PlayerMySQLManager();
    const playerService = new PlayerService(playerMySQLManager);
    const rankingMySQLManager = new RankingMySQLManager(ranking);
    const rankingService = new RankingService(rankingMySQLManager);
    return {
        playerService,
        rankingService
    }
}
