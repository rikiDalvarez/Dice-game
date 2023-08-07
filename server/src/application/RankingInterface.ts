
import { Ranking } from "../domain/Ranking";



export interface RankingInterface {
  //getPlayersRanking(): Promise<Ranking>;
  //getMeanSuccesRate():Promise<Ranking>;
  getRankingWithAverage():Promise<Ranking>
  getLoser(): Promise<Ranking>;
  getWinner(): Promise<Ranking>;
}
