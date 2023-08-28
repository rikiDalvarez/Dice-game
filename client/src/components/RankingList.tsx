import React from 'react'

function RankingList({ ranking }) {
	console.log(ranking, "ranking props")
	return (
		<div>{ranking.name}</div>
	)
}

export default RankingList