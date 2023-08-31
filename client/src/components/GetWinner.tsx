import React, { useEffect, useState, useCallback } from "react";
import { fetchGetWinner } from "../services";

type WinnerType = {
  isGetWinnerInProgress: boolean;
  setGetWinnerInProgress: (state: boolean) => void;
  setRefreshDashboard: (param:boolean) => void;
};

export interface Winner {
  id:string;
  name: string;
  successRate: string;
}

export const GetWinner: React.FC<WinnerType> = (props) => {
  const [winners, setWinners] = useState([]);
  
  const getWinner = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchGetWinner(token);

      if (response.ok) {
        const responseData = await response.json();
        setWinners(responseData);
        console.log('winner', responseData);
      } else {
        console.error("fetching games");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    props.setRefreshDashboard(true)
  }, [props])

  useEffect(() => {
    if (props.isGetWinnerInProgress) {
      props.setGetWinnerInProgress(false);
      getWinner();
    }
  }, [getWinner, props]);

  return (
    <div className=" w-full p-6 bg-white rounded-lg shadow-lg">
      {winners ? (
        <div>
          {winners.map((winner: Winner) => {
            const name = winner.name? winner.name: "Anonim"
            
            return (
              <div key={winner.id}>
                <p>Winner:</p>
                <p>Name: {name}</p> <p>Success rate:{winner.successRate}</p>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
