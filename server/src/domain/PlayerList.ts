import { Player } from "./Player"

export type PlayerDetailsType = {
  name: string,
  rating:number
}

export class PlayerList {
  readonly playerlist: Array<PlayerDetailsType>
  constructor(players: Array<Player>) {
    this.playerlist = this.preparePlayersDetails(players)
  }

  public preparePlayersDetails(players: Array<Player>): Array<PlayerDetailsType> {
    return players.map((player) => { return { name: player.name, rating: player.successRate } })
  }

}