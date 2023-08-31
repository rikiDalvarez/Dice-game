import React, { useState, useContext } from "react";
import { GetLoser } from "./GetLoser";
import { GetWinner } from "./GetWinner";
import { UserContext } from "../context/UserContext";
import {fetchToken } from "../services";

type GetGameDateProps = {
  handleRefreshGames: () => void;
  setRankingChoosen: (param:boolean) => void;
  setData: (data: unknown) => void;
  //setGetWinnerInProgress: (param: boolean) => void;
  // setGetLoserInProgress: (param: boolean) => void;
};

const GetGameData: React.FC<GetGameDateProps> = (props) => {
  const [isGetWinnerInProgress, setGetWinnerInProgress] = useState(false);
  const [isGetLoserInProgress, setGetLoserInProgress] = useState(false);
  const userContext = useContext(UserContext);

  const { user } = userContext;
  console.log("userContext getgamedata", user);


  

  return (
    <div className=" w-60 getGameData m-4 p-4 border-2 border-sky-500 flex flex-col rounded-lg">
      <button
        onClick={() => props.setRankingChoosen(false)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
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
      <button
        onClick={() => {
          props.setRankingChoosen(true);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        GetRanking
      </button>
      

      {!isGetLoserInProgress ? (
        <div>
          <GetWinner
            isGetWinnerInProgress={isGetWinnerInProgress}
            refreshDashboard={props.handleRefreshGames}
            setGetWinnerInProgress={setGetWinnerInProgress}
          />
        </div>
      ) : (
        ""
      )}
      {!isGetWinnerInProgress ? (
        <GetLoser
          isGetLoserInProgress={isGetLoserInProgress}
          refreshDashboard={props.handleRefreshGames}
          setGetLoserInProgress={setGetLoserInProgress}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default GetGameData;
