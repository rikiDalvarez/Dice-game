import React, { useContext, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import UserDataManipulation from "./components/UserDataManipulation";
import { PlayerList } from "./components/PlayerList";
import GetGameData from "./components/GetGameData";
import GameList from "./components/GameList";
import RankingList from "./components/RankingList";
// TODO import jwt_decode from "jwt-decode";
// TODO import { JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";


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
}

const Dashboard: React.FC<DashboardProps> = (props) => {
	const [refreshGameList, setRefreshGameList] = useState(false);
	const [refreshDashboard, setRefreshDashboard] = useState(false);
	const [isRankingChoosen, setRankingChoosen] = useState(true);


	const navigate = useNavigate();

	const userContext = useContext(UserContext)


	const logout = () => {
		console.log("Logging out...");
		localStorage.clear();
		props.setIsLoggedIn(false);
		userContext.setIsTokenValid(false)
		navigate("/")
	};

	/* Throttling navigation to prevent the browser from hanging. See https://crbug.com/1038223. Command line switch --disable-ipc-flooding-protection can be used to bypass the protection */

	//one more condition to secure navigation to login if token not valid
	// if (!userContext.isTokenValid) {
	// 	navigate("/")
	// }

	useEffect(() => {

    if (!userContext.isTokenValid) {
      navigate("/")
    }
    
		console.log("dashboard ref");
		if (refreshGameList) {
			setRefreshGameList(false);
		}
		if (refreshDashboard) {
			setRefreshDashboard(false);
		}
	}, [refreshGameList, refreshDashboard]);

	// const token = localStorage.getItem("token");

	const name = localStorage.getItem("name");

	// TODO:
	// if (token) {
	//   const decodedToken: JwtPayload = jwt_decode(token);
	//   const currentDate = new Date();
	//   const tokenExpiration = decodedToken.exp ? decodedToken.exp : null;
	//   if (tokenExpiration) {
	//     if (tokenExpiration * 1000 < currentDate.getTime()) {
	//       console.log("Token expired.");
	//       props.setIsLoggedIn(false)
	//     } else {
	//       console.log("Valid token");
	//     }
	//   }
	// }

	return (
		<div className="flex-col">
			<>
				<Navbar name={name} />
				<div className="m-5  border-t-4 border-double border-emerald-950 flex max-h-360 ">
					<UserDataManipulation setRefreshDashboard={setRefreshDashboard} refreshDashboard={refreshDashboard} />
					{isRankingChoosen ? (
						<RankingList
							refreshDashboard={refreshDashboard}
						/>
					) : (
						<PlayerList setIsRankingChoosen={setRankingChoosen} />
					)}
					<GetGameData
						setRankingChoosen={setRankingChoosen}
						setRefreshDashboard={setRefreshDashboard}
					/>
				</div>
				<GameList refreshGames={refreshGameList} />
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
