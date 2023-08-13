import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
	const [data, setData] = useState<string | null>(null);

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
						setData(JSON.stringify(responseData));
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
			{data ? <pre>{data}</pre> : <p>Loading...</p>}
		</div>
	);
};

export default Dashboard;
