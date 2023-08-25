import React from 'react'

interface Game {
	gameWin: boolean;
	dice1Value: number;
	dice2Value: number;
}

interface Props {
	props: Game
}

const Game: React.FC<Props> = ({ props }) => {
	console.log(props, "props")
	return (
		<div className={`card font-mono ${props.gameWin ? 'bg-green-200' : "bg-amber-200"
			} `}
			key={props.dice1Value + props.dice2Value}>
			<div className="m-2 p-2 border-2" >
				<p>dice 1 value: {props.dice1Value}</p>
				<p>dice 2 value: {props.dice2Value}</p>
				<p>{props.gameWin ? "Won" : "Lost"}</p>
			</div>
		</div>
	)
}

export default Game