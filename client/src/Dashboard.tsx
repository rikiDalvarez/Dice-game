import React, { useState, useEffect, useContext } from "react";
import Navbar from "./components/Navbar";
import UserDataManipulation from "./components/UserDataManipulation";
import { PlayerList } from "./components/PlayerList";
import GetGameData from "./components/GetGameData";
import GameList from "./components/GameList";
import { useNavigate } from "react-router-dom";
import { IPlayer } from "./components/Player";
import RankingList from "./components/RankingList";
import { UserContext } from "./context/UserContext";
import jwt_decode from "jwt-decode";
import { JwtPayload } from "jwt-decode";

//after refreshing the dashboard we lose userContext

export interface playerRanking {
  name: string | null;
  successRate: number;
}
export interface IRanking {
  ranking: playerRanking[];
  average: number;
}

interface DashboardProps {
  setIsLoggedIn: (param: boolean) => void;
  name?: string | null;
  id?: string | null;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [data, setData] = useState<Array<IPlayer> | null>(null);
  const [refreshGameList, setRefreshGameList] = useState(false);
  const [refreshDashboard, setRefreshDashboard] = useState(false);
  const [isRankingChoosen, setRankingChoosen] = useState(true);

  const userContext = useContext(UserContext);

  //using context instead of localStorage
  const { user } = userContext;
  console.log("userContextDashboard", user);

  const handleRankingSetUp = (data: IRanking[]) => {
    setRanking(data);
  };

  const handleRefreshGames = () => {
    setRefreshGameList(true);
  };

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    props.setIsLoggedIn(false);
  };

  useEffect(() => {
    if (refreshGameList) {
      setRefreshGameList(false);
    }
  }, [refreshGameList]);

  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken: JwtPayload = jwt_decode(token);
    const currentDate = new Date();
    const tokenExpiration = decodedToken.exp ? decodedToken.exp : null;
    if (tokenExpiration) {
      if (tokenExpiration * 1000 < currentDate.getTime()) {
        console.log("Token expired.");
      } else {
        console.log("Valid token");
      }
    }
  }

  return (
    <div className="flex-col">
      <>
        <Navbar name={props.name} />
        <div className="m-5  border-t-4 border-double border-emerald-950 flex ">
          <UserDataManipulation
            handleRefreshGames={handleRefreshGames}
            setRefreshDashboard={setRefreshDashboard}
          />
          {isRankingChoosen ? (
            <RankingList />
          ) : (
            <PlayerList setIsRankingChoosen={setRankingChoosen} />
          )}
          <GetGameData
            setRankingChoosen={setRankingChoosen}
            handleRefreshGames={handleRefreshGames}
            setData={setData}
          />
        </div>
        <GameList id={props.id} refreshGames={refreshGameList} />
        <div>
          <button
            onClick={logout}
            className="bg-amber-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </>
    </div>
  );
};

export default Dashboard;
