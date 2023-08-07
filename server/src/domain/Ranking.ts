import { Player, PlayerType } from "./Player";
import { PlayerDetailsType } from "./PlayerList";

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

export class Ranking2 {
  //PlayerTypeRanking{exlcuir ID, password}

  _ranking: Array<PlayerType>;
  _average: number;
  _losers: Array<PlayerType>;
  private _winners: Array<Player>;
  constructor() {
    (this._ranking = []),
      (this._average = 0),
      (this._losers = []),
      (this._winners = []);
  }

  public set ranking(players: Array<PlayerType>) {
    const ranking = players.map((player) => {
      return { name: player.name, rating: player.successRate };
    });
    this._ranking = ranking;
  }

  //   return players.map((player) => {
  //     return { name: player.name, rating: player.successRate };
  //   });

  public set average(meanValue: number) {
    this._average = meanValue;
  }
  public set losers(players: Array<PlayerType>) {
    this._losers = players;
  }
  public set winner(players: Array<PlayerType>) {
    this._winners = players;
  }
}
