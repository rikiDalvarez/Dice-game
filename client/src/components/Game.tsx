import React from 'react'

function Game({ props }) {
	return (
		<div className="card font-mono" key={props.id}>
			<div className="m-2 p-2 border-2" key={props.email}>
				<h3>{props.id}</h3>
				<p>Rating: {props.gameWin}</p>
			</div>
		</div>
	)
}

export default Game