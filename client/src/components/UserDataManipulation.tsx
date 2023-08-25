
import React from 'react'
import PlayGame from './PlayGame'
import ChangeName from './ChangeName'
import DeleteGames from './DeleteGames'

function UserDataManipulation() {
	return (
		<div className='userDataManipulation border-2 border-sky-500 m-4 p-4'>
			<h1>userDataManipulation</h1>
			<PlayGame />
			<ChangeName />
			<DeleteGames />
		</div>

	)
}

export default UserDataManipulation