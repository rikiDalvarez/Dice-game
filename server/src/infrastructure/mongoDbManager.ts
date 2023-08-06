import { Player} from "../domain/Player";
import { PlayerInterface } from "../application/PlayerInterface";
import { PlayerDocument } from "../mongoDbModel";
import { User } from "../domain/User";
import { GameType } from "../domain/Player";
import { RankingInterface } from "../application/RankingInterface";
import { Ranking } from "../domain/Ranking";
import { PlayerList } from "../domain/PlayerList";




export class PlayerMongoDbManager implements PlayerInterface {
  //response returns empty array, should return the player created
  
  createPlayerDoc(player:Player){
    return {
      id: player.id,
      email:player.email,
      password: player.password,
      games:player.games,
      name:player.name,
      successRate: player.successRate
    };
  }
  
  
  async createPlayer(player: User): Promise<string> {
    const newPlayer = {
      email:player.email,
      password: player.password,
      name:player.name,
      games: [],
      successRate: 0
    };
    const playerFromDB = await PlayerDocument.create(newPlayer);
    return playerFromDB.id;
  }

  async findPlayer(playerID: string): Promise<boolean> {
    const player = await PlayerDocument.findById(playerID);
    return player ? true : false;

    // if not better with Elvis,  we can come back to if and else
    /*
    if (player) {
      return true;
    }
    return false;
    */
  }

  async readPlayer(playerId: string): Promise<Player> {
    const playerDetails = await PlayerDocument.findById(playerId);
    if (playerDetails) {
      console.log("Player details retrieved:", playerDetails);
      const { name, email, password, games, id } = playerDetails;
      console.log("games", games)
      return new Player(email, password, games, name, id);
    } else {
      throw new Error("Player not found");
    }
  }




  async getPlayerList(): Promise<PlayerList> {
    const playersFromDB = await PlayerDocument.find({});
    const players = playersFromDB.map((players) => {
      return new Player(
        players.email,
        players.password,
        players.games,
        players.name,
        players.id
      );
    });
    return new PlayerList(players);

    //--------------->I have changed this part for that above. We dont have to prepare
    // Player class object since our model expect Player. We can pass it directly to class PlayerList
    //Also find method return empty array so we dont need to validate with if in this case
    //I created PlayerDetailsType....
    /*
    if (playersFromDB) {
      return playersFromDB.map((player) => {
        return new Player(
          player.email,
          player.password,
          player.games,
          player.name,
          player.id
        );
      });
    } else {
      throw new Error("Player not found");
    }
    */
  }

  async changeName(playerId: string, newName: string): Promise<boolean> {
    //check if name is in use
    const nameAlreadyInUse = await PlayerDocument.findOne({ name: newName });
    if (nameAlreadyInUse) {
      //add error handling
      throw new Error("name already in use, please choose another name");
    }
    //find and update
    const player = await PlayerDocument.findByIdAndUpdate(playerId, {
      name: newName,
    });
    if (!player) {
      //add error handler
      throw new Error("player not found");
    }
    return true;
  }

  async addGame(player: Player): Promise<boolean> {
    console.log(player)
    const id = player.id;
    return PlayerDocument.replaceOne({ _id: { $eq: id } }, this.createPlayerDoc(player))
      .then((response) => {
        return response.modifiedCount === 1;
      })
      .catch((err) => {
        throw err;
      });
  }

  async deleteAllGames(player: Player): Promise<boolean> {
    const id = player.id;
    return PlayerDocument.replaceOne({ _id: { $eq: id } }, this.createPlayerDoc(player))
      .then((response) => {
        return response.modifiedCount === 1;
      })
      .catch((err) => {
        throw err;
      });
  }

  // we don't need to delete players
  async deletePlayer(playerId: string): Promise<boolean> {
    const deletePlayer = await PlayerDocument.findByIdAndDelete(playerId);
    return deletePlayer ? true : false;

    // if not better with Elvis,  we can come back to if and else
    /*
    if (deleteplayer) {
      return true;
    }
    return false;
    */
  }

  async getGames(playerId: string): Promise<Array<GameType>> {
    const player = await PlayerDocument.findById(playerId);
    console.log(player)
    return player ? player.games : [];
    /*
    if (!player) {
      return []
    }
    const { games } = player;
    return games;
*/
  }
}

export class RankingMongoDbManager implements RankingInterface {


  async getMeanSuccesRate(): Promise<number | null> {
    const meanValue = await PlayerDocument.aggregate([
      {
        $group: {
          _id: null,
          meanValue: { $avg: "$successRate" },
        },
      },
    ]);
    return meanValue.length > 0 ? meanValue[0].meanValue : null;
  }

  async getPlayersRanking(): Promise<Ranking> {
    const playerRanking = await PlayerDocument.find().sort({ successRate: -1 });
    const players = playerRanking.map((players) => {
      return new Player(
        players.email,
        players.password,
        players.games,
        players.name,
        players.id
      );
    })
    return new Ranking(players);
  }

  async getWinner(): Promise<Player | null> {
    const winner = await PlayerDocument.find().findOne(
      {},
      { sort: { succesRate: -1 } }
    );
    if (!winner) {
      return null;
    }
    const {name, email, id,  password, games} = winner
    return new Player(email, password, games, name, id);
  }

  async getLooser(): Promise<Player | null> {
    const looser = await PlayerDocument.find().findOne(
      {},
      { sort: { succesRate: 1 } }
    );
    if (!looser) {
      return null;
    }
    const {name, email, id, games, password} = looser
    return new Player(email, password, games, name, id)
  }




}
