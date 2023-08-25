
import React from 'react'
import PlayGame from './PlayGame'
import ChangeName from './ChangeName'
import DeleteGames from './DeleteGames'

function UserDataManipulation() {
	return (
		<div className='userDataManipulation border-2 border-sky-500 m-4 p-4 flex flex-col'>
			<h1>userDataManipulation</h1>
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>Play Game</button>
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>Change Name</button>
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>Delete Games</button>
			{/* <PlayGame /> */}
			{/* <ChangeName /> */}
			{/* <DeleteGames /> */}
		</div>

	)
}

export default UserDataManipulation