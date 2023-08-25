import React, { useState } from 'react'
import Game from './Game'

function GameList() {
	const [games, setGames] = useState([])


	// useEffect(() => {
	// 	getGames(id)
	// }, [])

	const getGames = async (id) => {
		try {
			const token = localStorage.getItem('token');

			if (token) {
				console.log(id)
				const response = await fetch(`http://localhost:8000/api/games/${id}`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.ok) {
					const responseData = await response.json();
					console.log(responseData)

					setGames(responseData);

				} else {
					console.error('fetching games');
				}
			} else {
				console.error('Token not found');
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	}
	const id = localStorage.getItem("id")
	console.log(id)
	getGames(id)

	console.log("games", games)

	return (
		<div>
			{games ? games.map((game) => <Game props={game} />) : "test"}
		</div>
	)
}

export default GameList