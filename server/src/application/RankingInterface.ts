import { Player } from "../domain/Player";




export interface RankingInterface {
  getPlayersRanking(): Promise<Array<Player>>;
  getMeanSuccesRate():Promise<number>;
  getLooser(): Promise<Player>;
  getWinner(): Promise<Player>;
}
