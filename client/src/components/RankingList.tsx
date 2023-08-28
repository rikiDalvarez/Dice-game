import React from 'react'

function RankingList({ ranking }) {
	console.log(ranking.ranking, "ranking props")
	return (
		<>
			{ranking.ranking.length > 0 ? (
				<div className='bg-blue-200 rounded-lg m-4 p-4 max-h-96 overflow-y-auto'>
					<div className="average">average : {ranking.average}</div>
					{ranking.ranking.map((player) => (
						<div className="card font-mono w-96" key={player.name}>
							<div className="m-2 p-2 border-2" >
								<h1>name: {player.name}</h1>
								<p>average: {player.successRate}</p>
							</div>
						</div>
					))}
				</div>
			) : (
				"blaaa"
			)}
		</>
	)

}

export default RankingList