import { Player } from "../domain/Player";
import { Ranking } from "../domain/Ranking";
import { RankingInterface } from "./RankingInterface";


export class RankingService {
  rankingInterface: RankingInterface;
  constructor(rankingInterface: RankingInterface) {
    this.rankingInterface = rankingInterface;
  }

  getPlayersRanking(): Promise<Ranking> {
    return this.rankingInterface.getPlayersRanking();
  }
  getMeanSuccesRate(): Promise<number|null> {
    return this.rankingInterface.getMeanSuccesRate();
  }

  getWinner(): Promise<Player|null> {
    return this.rankingInterface.getWinner();
  }

  getLooser(): Promise<Player|null> {
    return this.rankingInterface.getWinner();
  }
}
