import React, { useState, useContext } from "react";
import { GetLoser } from "./GetLoser";
import { GetWinner } from "./GetWinner";
import { IRanking } from "../Dashboard";
import { UserContext } from "../context/UserContext";


import { GetRanking } from "./GetRanking";
import { fetchGetRanking, fetchToken } from "../services";

type GetGameDateProps = {
  handleRefreshGames: () => void;
  handleRankingSetUp: (data: IRanking | null) => void;
  setData: (data: unknown) => void;
  // setGetWinnerInProgress: (param: boolean) => void;
  //setGetLoserInProgress: (param: boolean) => void;

};


const GetGameData: React.FC<GetGameDateProps> = (props) => {
  const [isGetWinnerInProgress, setGetWinnerInProgress] = useState(false);
  const [isGetLoserInProgress, setGetLoserInProgress] = useState(false);

  const userContext = useContext(UserContext)

  const { user } = userContext;
  console.log("userContext getgamedata", user)

  const handleClickGetRanking = async () => {
    const response = await (await fetchGetRanking(user.token)).json()
    props.handleRankingSetUp(response)
  }

  const handleClickGetPlayerList = async () => {
    const response = await fetchToken(user.token)
    if (response.ok) {
      const responseData = await response.json()
      console.log("new playerlist", responseData)
      props.handleRankingSetUp(null)
      props.setData(responseData.playerList)
    }
  }


  return (
    <div className=" w-60 getGameData m-4 p-4 border-2 border-sky-500 flex flex-col rounded-lg">
      <button
        onClick={() => handleClickGetPlayerList()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
        onClick={() => { handleClickGetRanking() }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        GetRanking
      </button>
      {/* <GetRanking /> */}

      {!isGetLoserInProgress ? (<div><GetWinner
        isGetWinnerInProgress={isGetWinnerInProgress}
        refreshDashboard={props.handleRefreshGames}
        setGetWinnerInProgress={setGetWinnerInProgress}
      /></div>) : ""}
      {!isGetWinnerInProgress ? <GetLoser
        isGetLoserInProgress={isGetLoserInProgress}
        refreshDashboard={props.handleRefreshGames}
        setGetLoserInProgress={setGetLoserInProgress}
      /> : ""}
    </div>
  );
};

export default GetGameData;
