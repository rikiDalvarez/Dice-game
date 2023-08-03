import { Player } from "../domain/Player";




export interface RankingInterface {
  getPlayersRanking(): Promise<Array<Player>>;
  getLooser(): Promise<Player>;
  getWinner(): Promise<Player>;
}
