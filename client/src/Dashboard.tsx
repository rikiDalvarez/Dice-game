import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './Login';
import UserDataManipulation from './components/UserDataManipulation';
import PlayerList from './components/PlayerList';
import GetGameData from './components/GetGameData';
import GameList from './components/GameList';
import { useNavigate } from 'react-router-dom';
import { fetchToken } from './services';
import { IPlayer } from './components/Player';

interface DashboardProps {
	name?: string | null;
	id?: string | null;
}


const Dashboard: React.FC<DashboardProps> = ({ name, id }) => {
	const [data, setData] = useState<Array<IPlayer> | null>(null);
	const [refreshGameList, setRefreshGameList] = useState(false);

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
		console.log("fetch")
		const fetchProtectedData = async () => {
			try {
				const token = localStorage.getItem('token');

				if (token) {
					const response = await fetchToken(token)

					if (response.ok) {
						const responseData = await response.json();

						setData(responseData.playerList);

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
						/>
						<PlayerList props={data} />
						<GetGameData handleRefreshGames={handleRefreshGames} />
						{/* {data.map((player) => (
							<div className="m-2 p-2 border-2" key={player.email}>
								<h3>{player.name}</h3>
								<p>Rating: {player.rating}</p>
								<p>Registration Date: {player.registrationDate}</p>
							</div>
						))} */}
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
