
import { Ranking } from "../domain/Ranking";



export interface RankingInterface {
  getPlayersRanking(): Promise<Ranking>;
  getMeanSuccesRate():Promise<Ranking>;
  getLoser(): Promise<Ranking>;
  getWinner(): Promise<Ranking>;
}
