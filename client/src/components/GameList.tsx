import React, { useState, useEffect } from 'react'
import Game from './Game'
interface GameListProps { // Define the prop here
	id: string | null;
}
const GameList: React.FC<GameListProps> = () => {
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
	useEffect(() => { getGames(id) }, [])


	console.log("games", games)

	return (
		<div className="bg-amber-200 rounded-lg m-4 p-4 max-h-80 overflow-y-auto">
			{games ? games.map((game) => <Game key={game.id} props={game} />) : "test"}
		</div>
	)
}

export default GameList