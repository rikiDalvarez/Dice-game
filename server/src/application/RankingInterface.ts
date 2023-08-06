import { Player } from "../domain/Player";
import { PlayerList } from "../domain/PlayerList";
import { Ranking } from "../domain/Ranking";



export interface RankingInterface {
  getPlayersRanking(): Promise<Ranking>;
  getMeanSuccesRate():Promise<number|null>;
  getLoser(): Promise<PlayerList>;
  getWinner(): Promise<Player[]>;
}
