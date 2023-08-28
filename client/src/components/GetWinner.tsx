import React, {  useEffect, useState, } from "react";
import { fetchGetWinner} from "../services";

type WinnerType = {
  isGetWinnerInProgress: boolean
  setGetWinnerInProgress: (state: boolean) => void;
  refreshDashboard: ()=> void

};

export interface Winner {
	name: string;
	successRate:string
}

export const GetWinner: React.FC<WinnerType> = (props) => {
	const [winners, setWinners] = useState([])

  const getWinner = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchGetWinner(token);
      
      if (response.ok) {
        const responseData = await response.json();
        setWinners(responseData)
        console.log(responseData);
      } else {
        console.error("fetching games");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
 
  };

  useEffect(() => {
    if (props.isGetWinnerInProgress) {
      props.setGetWinnerInProgress(false);
      getWinner();
    }
  }, [props]);

  return (
    <div className=" w-full p-6 bg-white rounded-lg shadow-lg">
      {winners ? (
        <div>
          {winners.map((winner:Winner) =><div><p>Winner:</p><p>{winner.name}</p> <p>{winner.successRate}</p></div> )}
        </div>
      ) : ""}
    </div>
  );
};

