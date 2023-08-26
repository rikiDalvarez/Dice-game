import React, { useState, useEffect } from 'react'
import Game from './Game'
import { fetchGameList } from '../services';
interface GameListProps { // Define the prop here
	id?: string | null;
}
const GameList: React.FC<GameListProps> = () => {
	const [games, setGames] = useState([])


	// useEffect(() => {
	// 	getGames(id)
	// }, [])

	const getGames = async (id: string | null) => {
		try {
			const token = localStorage.getItem('token');

			if (token) {
				console.log(id)
				const response = await fetchGameList(token, id);
				console.log("response", response)
				if (response.ok) {
					const responseData = await response.json();
					console.log("Games", responseData)

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
		<div className=" rounded-lg m-4 p-4 max-h-80 overflow-y-auto">
			{games ? games.map((game) => <Game props={game} />) : "test"}
		</div>
	)
}

export default GameList