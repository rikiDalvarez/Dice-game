import { Player } from "../domain/Player";
import { Ranking } from "../domain/Ranking";



export interface RankingInterface {
  getPlayersRanking(): Promise<Ranking>;
  getMeanSuccesRate():Promise<number|null>;
  getLoser(): Promise<Player[]>;
  getWinner(): Promise<Player[]>;
}
