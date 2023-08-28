import React, { useState } from "react";
import { GetLoser } from "./GetLoser";
import { GetWinner } from "./GetWinner";

type GetGameDateProps = {
  handleRefreshGames: () => void;
 // setGetWinnerInProgress: (param: boolean) => void;
  //setGetLoserInProgress: (param: boolean) => void;
};

const GetGameData: React.FC<GetGameDateProps> = (props) => {
  const [isGetWinnerInProgress, setGetWinnerInProgress] = useState(false);
  const [isGetLoserInProgress, setGetLoserInProgress] = useState(false);

  return (
    <div className="getGameData m-4 p-4 border-2 border-sky-500 flex flex-col rounded-lg">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        GetPlayers
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setGetWinnerInProgress(true);
        }}
      >
        GetWinner
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setGetLoserInProgress(true);
        }}
      >
        GetLoser
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        GetRanking
      </button>

      {!isGetLoserInProgress?(<div><GetWinner
        isGetWinnerInProgress={isGetWinnerInProgress}
        refreshDashboard={props.handleRefreshGames}
        setGetWinnerInProgress={setGetWinnerInProgress}
      /></div>): ""}
      {!isGetWinnerInProgress?<GetLoser
        isGetLoserInProgress={isGetLoserInProgress}
        refreshDashboard={props.handleRefreshGames}
        setGetLoserInProgress={setGetLoserInProgress}
      />:""}
    </div>
  );
};

export default GetGameData;
