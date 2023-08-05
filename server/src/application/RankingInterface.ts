import { Player } from "../domain/Player";
import { Ranking } from "../domain/Ranking";



export interface RankingInterface {
  getPlayersRanking(): Promise<Ranking>;
  getMeanSuccesRate():Promise<number|null>;
  getLooser(): Promise<Player|null>;
  getWinner(): Promise<Player|null>;
}
