import React from 'react'

function Game({ props }) {
	console.log(props, "props")
	return (
		<div className="card font-mono" key={props.dice1Value + props.dice2Value}>
			<div className="m-2 p-2 border-2" >
				<p>dice 1 value: {props.dice1Value}</p>
				<p>dice 2 value: {props.dice2Value}</p>
				<p>Rating: {(props.gameWin).toString()}</p>
			</div>
		</div>
	)
}

export default Game