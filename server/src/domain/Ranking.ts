import { Player } from "./Player";
import { PlayerDetailsType } from "./PlayerList";

export class Ranking {
  readonly ranking: Array<PlayerDetailsType>;
  private _looser:Array<Player>;
  constructor(players: Array<Player>) {
    this.ranking = this.preparePlayersDetails(players);
    this._looser = []
  }

  private preparePlayersDetails(players: Array<Player>): Array<PlayerDetailsType> {
    return players.map((player) => {
      return { name: player.name, rating: player.successRate };
    });
  }
  

}
