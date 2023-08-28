import React, { useState, useEffect, useContext } from 'react';
import Navbar from './components/Navbar';
import Login from './Login';
import UserDataManipulation from './components/UserDataManipulation';
import PlayerList from './components/PlayerList';
import GetGameData from './components/GetGameData';
import GameList from './components/GameList';
import { useNavigate } from 'react-router-dom';
import { fetchToken } from './services';
import { IPlayer } from './components/Player';
import RankingList from "./components/RankingList"
import { UserContext } from './context/UserContext';

//after refreshing the dashboard we lose userContext


export interface IRanking {
	name: string | null;
	successRate: number;
}

interface DashboardProps {
	name?: string | null;
	id?: string | null;
}


const Dashboard: React.FC<DashboardProps> = ({ name, id }) => {

	const [data, setData] = useState<Array<IPlayer> | null>(null);
	const [refreshGameList, setRefreshGameList] = useState(false);
	const [ranking, setRanking] = useState<Array<IRanking>>([])

	const userContext = useContext(UserContext);

	//using context instead of localStorage
	const { user } = userContext;
	console.log("userContextDashboard", user)

	const handleRankingSetUp = (data: IRanking[]) => {
		setRanking(data)
	}

	const handleRefreshGames = () => {
		setRefreshGameList(true);
	};

	const navigate = useNavigate();

	const logout = () => {
		localStorage.clear()
		setData(null)
		navigate("/")
	}


	useEffect(() => {
		// flag for component rankingList
		// setRanking([{ name: "riki", successRate: 0 }])
		const fetchProtectedData = async () => {
			try {
				const token = localStorage.getItem('token');

				if (token) {
					const response = await fetchToken(token)

					if (response.ok) {
						const responseData = await response.json();

						setData(responseData.playerList.reverse());

					} else {
						console.error('Fetching players');
					}
				} else {
					console.error('Token not found');
				}
			} catch (error) {
				console.error('An error occurred:', error);
			}
		};
		if (refreshGameList) {
			fetchProtectedData();
			setRefreshGameList(false)
		}
		if (!data) {
			fetchProtectedData();
		}


	}, [refreshGameList, data]);



	return (
		<div className='flex-col'>
			{data ? (
				<>
					<Navbar name={name} />
					<div className="m-5  border-t-4 border-double border-emerald-950 flex ">
						<UserDataManipulation
							handleRefreshGames={handleRefreshGames}
						/>{
							ranking.length > 0 ? <RankingList ranking={ranking} /> : <PlayerList props={data} />
						}
						<GetGameData handleRankingSetUp={handleRankingSetUp} handleRefreshGames={handleRefreshGames} />
					</div>
					<GameList id={id} refreshGames={refreshGameList} />
					<div>
						<button onClick={logout} className="bg-amber-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Logout</button>
					</div>
				</>
			) : (
				<Login />
			)}
		</div>
	);

};

export default Dashboard;
