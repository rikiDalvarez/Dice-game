import { Ranking } from "../domain/Ranking";

export interface RankingInterface {
  getRankingWithAverage(): Promise<Ranking>;
  getLoser(): Promise<Ranking>;
  getWinner(): Promise<Ranking>;
}
