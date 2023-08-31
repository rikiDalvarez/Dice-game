import Player, { IPlayer } from "./Player";
import { fetchToken } from "../services";
import React, { useEffect, useState } from "react";

interface PlayerListI {
  setIsRankingChoosen: (param: boolean) => void;
}

export const PlayerList: React.FC<PlayerListI> = (props) => {
  const [playerList, setPlayerList] = useState([]);
  console.log("playerlist");
  const getPlayerList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchToken(token);
      if (response.ok) {
        const responseData = await response.json();
        setPlayerList(responseData.playerList);
        console.log(responseData);
      } else {
        console.error("fetching games");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    props.setIsRankingChoosen(false);
    getPlayerList();
  }, [props]);

  return (
    <div className="bg-blue-200 rounded-lg m-4 p-4 max-h-96 overflow-y-auto">
      {playerList
        ? playerList.map((player: IPlayer) => (
            <Player key={player.email} props={player} />
          ))
        : "something went wrong"}
    </div>
  );
};
