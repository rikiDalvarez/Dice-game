import { Player } from "./Player";

export type PlayerDetailsType = {
  id: string;
  name: string|null;
  rating: number;
  registrationDate: Date;
  email: string;
};

export class PlayerList {
  readonly playerList: Array<PlayerDetailsType>;
  constructor(players: Array<Player>) {
    this.playerList = this.preparePlayersDetails(players);
  }

  public preparePlayersDetails(
    players: Array<Player>
  ): Array<PlayerDetailsType> {
    return players.map((player) => {
      return {
        id: player.id,
        name: player.name,
        rating: player.successRate,
        registrationDate: player.registrationDate,
        email: player.email
      };
    });
  }

  sortList() {
    return this.playerList.sort();
  }
}
