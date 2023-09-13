import React, { useState, useContext } from "react";
import { GetLoser } from "./GetLoser";
import { GetWinner } from "./GetWinner";
import { UserContext } from "../context/UserContext";

type GetGameDateProps = {
  setRankingChoosen: (param: boolean) => void;
  setRefreshDashboard: (param: boolean) => void
};

const GetGameData: React.FC<GetGameDateProps> = (props) => {
  const [isGetWinnerInProgress, setGetWinnerInProgress] = useState(false);
  const [isGetLoserInProgress, setGetLoserInProgress] = useState(false);

  const userContext = useContext(UserContext);

  const { user } = userContext;
  console.log("userContext getgamedata", user);

  return (

    // TODO fix layout when button clicked
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
            setRefreshDashboard={props.setRefreshDashboard}
            setGetWinnerInProgress={setGetWinnerInProgress}
          />
        </div>
      ) : (
        ""
      )}
      {!isGetWinnerInProgress ? (
        <GetLoser
          isGetLoserInProgress={isGetLoserInProgress}
          setRefreshDashboard={props.setRefreshDashboard}
          setGetLoserInProgress={setGetLoserInProgress}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default GetGameData;
