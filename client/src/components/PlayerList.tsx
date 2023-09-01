import Player, { IPlayer } from "./Player";
import { fetchPlayerList } from "../services";
import React, { useEffect, useState } from "react";

interface PlayerListI {
  setIsRankingChoosen: (param: boolean) => void;
}

export const PlayerList: React.FC<PlayerListI> = (props) => {
  const [playerList, setPlayerList] = useState([]);
  const getPlayerList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchPlayerList(token);
      if (response.ok) {
        const responseData = await response.json();
        setPlayerList(responseData.playerList);
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
    <div className="bg-blue-200 rounded-lg m-4 p-4 max-h-96 overflow-y-auto shadow-lg ">
      {playerList
        ? playerList.map((player: IPlayer) => (
          <Player key={player.id} props={player} />
        ))
        : "something went wrong"}
    </div>
  );
};
