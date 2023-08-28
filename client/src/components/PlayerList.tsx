
import React from 'react';
import Player, { IPlayer } from './Player';

interface Props {
	props: IPlayer[];
}

const PlayerList: React.FC<Props> = ({ props }) => {
	return (
		<div className='bg-blue-200 rounded-lg m-4 p-4 max-h-80 overflow-y-auto'>
			{props
				? props.map((player) => <Player key={player.email} props={player} />)
				: 'something went wrong'}
		</div>
	);
}

export default PlayerList;
