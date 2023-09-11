import React, { useEffect, useState, useCallback } from "react";
import { fetchGetLoser } from "../services";

type LoserType = {
  isGetLoserInProgress: boolean;
  setGetLoserInProgress: (state: boolean) => void;
  setRefreshDashboard: (param: boolean) => void;
};

export interface Loser {
  id: string;
  name: string;
  successRate: string;
}

export const GetLoser: React.FC<LoserType> = (props) => {
  const [losers, setLosers] = useState([]);

  const getLoser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchGetLoser(token);

      if (response.ok) {
        const responseData = await response.json();
        setLosers(responseData);
        console.log(responseData);
      } else {
        console.error("fetching games");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    props.setRefreshDashboard(true)
  }, [props])

  useEffect(() => {
    if (props.isGetLoserInProgress) {
      props.setGetLoserInProgress(false);
      getLoser();
    }
  }, [getLoser, props]);

  return (
    <div className=" w-full p-6 bg-white  shadow-lg">
      {losers ? (
        <div>
          {losers.map((loser: Loser) => {
            const name = loser.name ? loser.name : "Anonim"
            return (
              <div className=" mt-2 bg-red-200" key={loser.id}>

                <p> {name}</p>
                <p>Success rate: {loser.successRate}</p>
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

