import { Ranking } from "../domain/Ranking";
import { RankingInterface } from "./RankingInterface";

export class RankingService {
  rankingInterface: RankingInterface;
  constructor(rankingInterface: RankingInterface) {
    this.rankingInterface = rankingInterface;
  }

  getRankingWithAverage(): Promise<Ranking> {
    return this.rankingInterface.getRankingWithAverage();
  }

  /*
  getPlayersRanking(): Promise<Ranking> {
    return this.rankingInterface.getPlayersRanking();
  }
  getMeanSuccesRate(): Promise<Ranking> {
    return this.rankingInterface.getMeanSuccesRate();
  }
*/

  getWinner(): Promise<Ranking> {
    return this.rankingInterface.getWinner();
  }

  getLoser(): Promise<Ranking> {
    return this.rankingInterface.getLoser();
  }
}
