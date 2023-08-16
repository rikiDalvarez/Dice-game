import React, { useState, useEffect } from 'react';
interface Player {
	name: string,
	rating: number,
	registrationDate: string
}

const Dashboard: React.FC = () => {
	const [data, setData] = useState<Array<Player> | null>(null);

	useEffect(() => {
		const fetchProtectedData = async () => {
			try {
				const token = localStorage.getItem('token');

				if (token) {
					const response = await fetch('http://localhost:5000/api/players', {
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
		<div>
			<h2>Dashboard</h2>
			{/* add loading skeleton shadcn */}
			{data ? (
				data.map((player) => (
					<div key={player.name}>
						<h3>{player.name}</h3>
						<p>Rating: {player.rating}</p>
						<p>Registration Date: {player.registrationDate}</p>
					</div>
				))
			) : <p>Loading...</p>}
		</div>
	);
};

export default Dashboard;
