
import React from 'react'
import PlayGame from './PlayGame'
import ChangeName from './ChangeName'
import DeleteGames from './DeleteGames'

function UserDataManipulation() {
	return (
		<>
			<h1>userDataManipulation</h1>
			<PlayGame/>
			<ChangeName />
			<DeleteGames/>
		</>

	)
}

export default UserDataManipulation