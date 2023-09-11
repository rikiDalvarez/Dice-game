import { IPlayer } from "./Player";
import { fetchGetRanking } from "../services";
import React, { useEffect, useState } from "react";

type RankingListType = {
  refreshDashboard: boolean
  //isRankingChoosen: boolean
};

export interface RankingListI {
  ranking: Array<IPlayer>;
  average: number;
}

const RankingList: React.FC<RankingListType> = (props) => {
  const [rankingList, setRankingList] = useState([]);
  const [average, setAverage] = useState();
  //console.log('props', props)
  const getRankingList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchGetRanking(token);
      if (response.ok) {
        const responseData = await response.json();
        setRankingList(responseData.ranking);
        setAverage(responseData.average);
      } else {
        console.error("fetching games");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }

  };

  useEffect(() => {
    getRankingList()
  }, [props]);

  return (
    <>
      <div className=" shadow-lg bg-blue-200 rounded-lg m-4 p-4 max-h-96 overflow-y-auto">
        <div className="average text-lg font-extrabold ">
          Average success rate : {average}
        </div>
        {rankingList.map((player: IPlayer) => {
          const playerName = player.name ? player.name : "Anonim";
          return (
            <div className="card font-mono w-96" key={player.id}>
              <div
                className={`m-2 p-2 border-2 ${player.successRate > 19
                    ? "bg-green-200"
                    : player.successRate > 10
                      ? "bg-amber-300"
                      : "bg-red-200"
                  }`}
              >
                <h1>Name: {playerName}</h1>
                <p>Success rate: {player.successRate}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RankingList;