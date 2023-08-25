// import React from 'react'
// import Player from './Player'

// function PlayerList({ props }) {
// 	console.log(props, "props1")
// 	return (
// 		<div className='bg-blue-200 rounded-lg m-4 p-4'>
// 			{props ? props.map((player) => (
// 				<Player props={player} />
// 			)) : "something went wrong"}
// 		</div>
// 	)
// }

// export default PlayerList
import React from 'react';
import Player from './Player';

function PlayerList({ props }) {
	return (
		<div className='bg-blue-200 rounded-lg m-4 p-4 max-h-80 overflow-y-auto'>
			{props
				? props.map((player) => <Player key={player.email} props={player} />)
				: 'something went wrong'}
		</div>
	);
}

export default PlayerList;
