import React, { useState,useEffect } from 'react';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import { fetchToken } from './services';
interface Player {
	name: string,
	rating: number,
	registrationDate: string
}


function App() {
	const [data, setData] = useState<Array<Player> | null>(null);

	//if user has token not expired, user is logged in and navigate to dashboard
	// dashboard will have all the components, navbar greeting the client , userInfo with userdata,
	// games result of last player games, and the buttons on the side
	//if token is expired or there is no token, render the login page
	//Create a register page
	useEffect(() => {
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

		fetchProtectedData();
	}, []);

	const name = localStorage.getItem("name")

	return (
		<div className="App">
			<div className="min-h-screen flex flex-col items-center justify-center bg-color-movement ">
				<img src="dices.png" className="w-20 h-30 mt-4" alt="dices" />
				<div className="  p-6 bg-white rounded-lg shadow-lg m-8">
					{data ? <Dashboard name={name} /> : <Login />}
				</div>
			</div>
		</div>
	);
}

export default App;