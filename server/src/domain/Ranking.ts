import { Player } from "./Player";

type RankingType = {
  name: string|null;
  successRate: number;
};

/*
export class Ranking {
  readonly ranking: Array<PlayerDetailsType>;
  private _looser:Array<Player>;
  constructor(players: Array<Player>) {
    this.ranking = this.preparePlayersDetails(players);
    this._looser = []
  }

  private preparePlayersDetails(
    players: Array<Player>
  ): Array<PlayerDetailsType> {
    return players.map((player) => {
      return { name: player.name, rating: player.successRate };
    });
  }
}
*/
export class Ranking {
  meanSuccesRate(): number {
    throw new Error("Method not implemented.");
  }
  private _rankingList: Array<RankingType>;
  private _average: number;
  private _losers: Array<RankingType>;
  private _winners: Array<RankingType>;
  constructor() {
    (this._rankingList = []),
      (this._average = 0),
      (this._losers = []),
      (this._winners = []);
  }

  private preparePlayersDetails(players: Array<Player>): Array<RankingType> {
    return players.map((player) => {
      return { name: player.name, successRate: player.successRate };
    });
  }
  public set rankingList(players: Array<Player>) {
    this._rankingList = this.preparePlayersDetails(players);
  }

  public set average(meanValue: number) {
    this._average = meanValue;
  }
  public set losers(losers: Array<Player>) {
    this._losers = this.preparePlayersDetails(losers);
  }
  public set winners(winners: Array<Player>) {
    this._winners = this.preparePlayersDetails(winners);
  }

  public get rankingList(): Array<RankingType> {
    return this._rankingList;
  }

  public get losers(): Array<RankingType> {
    return this._losers;
  }

  public get winners(): Array<RankingType> {
    return this._winners;
  }

  public get average(): number {
    return this._average;
  }
}
