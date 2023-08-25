import React from 'react'

function GetGameData() {
	return (
		<div className="getGameData m-4 p-4 border-2 border-sky-500 flex flex-col">
			GetGameData
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>GetPlayers</button>
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>GetWinner</button>
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>GetLosers</button>
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>GetRanking</button>
		</div>
	)
}

export default GetGameData