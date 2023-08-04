import { Player} from "./Player"
export class Ranking {
    readonly players:Array<Player>
    constructor(players:Array<Player>){
        this.players = players
    }

    public meanSuccesRate():number{
        
        const succesRateSum = this.players.reduce((sum, player)=>  {return sum + player.succesRate},0)
        return succesRateSum >0 ? Number((succesRateSum / this.players.length).toFixed(2)) :0
    }
}