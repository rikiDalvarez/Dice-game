import { Player } from "./Player";
export class Ranking {
  readonly ranking;
  constructor(players: Array<Player>) {
    this.ranking = this.prepareRanking(players);
  }

  private prepareRanking(players: Array<Player>) {
    return players.map((player) => {
      return { name: player.name, rating: player.successRate };
    });
  }
  //public meanSuccesRate():number{

  //    const succesRateSum = this.players.reduce((sum, player)=>  {return sum + player.succesRate},0)
  //  return succesRateSum >0 ? Number((succesRateSum / this.players.length).toFixed(2)) :0
  //}
}
