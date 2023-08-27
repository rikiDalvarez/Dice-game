import React from 'react'
import { fetchDeleteGames } from '../services';

const DeleteGames: React.FC = () => {
	const token = localStorage.getItem("token");
	const player_id = localStorage.getItem("id");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetchDeleteGames(token, player_id);
			if (response.ok) {
				const responseData = await response.json();
				console.log("responseData", responseData)
				if (responseData.games_deleted === true) {
					console.log('All games deleted succesfully')
				} else {
					console.error("Error ocurred during deletetion")
				}
			} else {
				console.error(response)
			}
		} catch (error) {
			console.error("an error occurred:", error)
		}
	}

	return (
		<form className="form">
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={handleSubmit}
			>
				Delete Games
			</button>
		</form>
	)
}

export default DeleteGames