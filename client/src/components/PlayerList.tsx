import React from 'react'
import Player from './Player'

function PlayerList({ props }) {
	console.log(props, "props1")
	return (
		<div>
			{props ? props.map((player) => (
				<Player props={player} />
			)) : "something went wrong"}
		</div>
	)
}

export default PlayerList