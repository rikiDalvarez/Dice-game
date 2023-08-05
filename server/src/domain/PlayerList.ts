import { Player} from "./Player"
export class PlayerList {
    readonly playerlist:Array<object>
    constructor(players:Array<Player>){
        this.playerlist = this.preparePlayerList(players)
    }

  public preparePlayerList (players:Array<Player>):Array<object>{
    return players.map((player)=> {return {name: player.name, rating: player.successRate}})
  }
  
}