import { Player } from "../domain/Player";
import { RankingInterface } from "./RankingInterface";


export class RankingService {
  rankingInterface: RankingInterface;
  constructor(rankingInterface: RankingInterface) {
    this.rankingInterface = rankingInterface;
  }

  getPlayerRanking(): Promise<Array<Player>> {
    return this.rankingInterface.getPlayersRanking();
  }
  getMeanSuccesRate(): Promise<number> {
    return this.rankingInterface.getMeanSuccesRate();
  }

  getWinner(): Promise<Player> {
    return this.rankingInterface.getWinner();
  }

  getLooser(): Promise<Player> {
    return this.rankingInterface.getWinner();
  }
}
