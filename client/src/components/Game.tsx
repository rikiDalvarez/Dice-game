import React from 'react'

export interface GameInterface {
	id: string;
	gameWin: boolean;
	dice1Value: number;
	dice2Value: number;
}

interface Props {
	props: GameInterface
}

const Game: React.FC<Props> = ({ props }) => {
	return (
		<div className={`w-96 card font-mono ${props.gameWin ? 'bg-green-200' : "bg-red-200"
			} `}
			key={props.id}>
			<div className="m-2 p-2 border-2" >
				<p>Dice 1 value: {props.dice1Value}</p>
				<p>Dice 2 value: {props.dice2Value}</p>
				<p>{props.gameWin ? "Won" : "Lost"}</p>
			</div>
		</div>
	)
}

export default Game