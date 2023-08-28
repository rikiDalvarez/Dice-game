import React from 'react'

export interface IPlayer {
	id: string;
	email: string;
	name: string;
	rating: number;
	registrationDate: string;
}

interface Props {
	props: IPlayer
}

const Player: React.FC<Props> = ({ props }) => {
	let backgroundColorClass = "bg-red-200"; // Default background color

	if (props.rating > 19) {
		backgroundColorClass = "bg-green-200";
	} else if (props.rating > 10) {
		backgroundColorClass = "bg-amber-300";
	}

	return (
		<div className="card font-mono " key={props.email} >
			<div className={`m-2 p-2 border-2 ${backgroundColorClass}`} key={props.email}>
				<h3>{props.name}</h3>
				<p>Rating: {props.rating}</p>
				<p>Registration Date: {props.registrationDate}</p>
			</div>
		</div >
	)
}

export default Player