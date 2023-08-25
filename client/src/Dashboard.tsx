import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './context/UserContext';
import Navbar from './components/Navbar';
import Login from './Login';
import UserDataManipulation from './components/UserDataManipulation';
import PlayerList from './components/PlayerList';
import GetGameData from './components/GetGameData';
import GameList from './components/GameList';
import { useNavigate } from 'react-router-dom';
interface Player {
	name: string,
	rating: number,
	registrationDate: string
}

interface DashboardProps {
	name: string | null; // Define the prop here
	id: string | null;
}


const Dashboard: React.FC<DashboardProps> = ({ name, id }) => {
	const [data, setData] = useState<Array<Player> | null>(null);

	const navigate = useNavigate();

	const userContext = useContext(UserContext)

	const logout = () => {
		localStorage.clear()
		setData(null)
		navigate("/")
	}


	useEffect(() => {


		const fetchProtectedData = async () => {
			try {
				const token = localStorage.getItem('token');

				if (token) {
					const response = await fetch('http://localhost:8000/api/players', {
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

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

		fetchProtectedData();
	}, []);

	return (
		<div className='flex-col'>
			{data ? (
				<>
					<Navbar name={name} />
					<div className="m-5  border-t-4 border-double border-emerald-950 flex ">
						<UserDataManipulation />
						<PlayerList props={data} />
						<GetGameData />
						{/* {data.map((player) => (
							<div className="m-2 p-2 border-2" key={player.email}>
								<h3>{player.name}</h3>
								<p>Rating: {player.rating}</p>
								<p>Registration Date: {player.registrationDate}</p>
							</div>
						))} */}
					</div>
					<GameList id={id} />
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
