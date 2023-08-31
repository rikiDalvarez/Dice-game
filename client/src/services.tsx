import { PORT } from "./config/config"

export interface FormData {
	email: string;
	password: string;
}

export interface RegistrationData {
	name: string | null;
	email: string;
	password: string;
}

export async function fetchLogin(data: FormData) {
	const response = await fetch(`http://localhost:${PORT}/api/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	return response
}

export const fetchRegistration = async (data: RegistrationData | null) => {
	const response = await fetch(`http://localhost:${PORT}/api/players`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	return response
}

export const fetchPlayerList = async (token: string | null) => {
	const response = await fetch(`http://localhost:${PORT}/api/players`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	return response;
}

export const fetchGameList = async (token: string | null, id: string | null) => {
	const response = await fetch(`http://localhost:${PORT}/api/games/${id}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,

		}
	})
	return response
}

export const fetchGetWinner = async (token: string | null) => {
	const response = await fetch(`http://localhost:${PORT}/api/ranking/winner`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,

		}
	})
	return response
}

export const fetchGetLoser = async (token: string | null) => {
	const response = await fetch(`http://localhost:${PORT}/api/ranking/loser`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,

		}
	})
	return response
}


export const changeName = async (token: string | null, id: string | null | undefined, newName: string) => {

	const data = { name: newName }
	console.log(JSON.stringify(data))
	const response = await fetch(`http://localhost:${PORT}/api/players/${id}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	return response
}

export const fetchPlayGame = async (token: string | null, id: string | null | undefined) => {
	const response = await fetch(`http://localhost:${PORT}/api/games/${id}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},

	})
	return response
}

export const fetchDeleteGames = async (token: string | null, player_id: string | null | undefined) => {
	const response = await fetch(`http://localhost:${PORT}/api/games/${player_id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		}
	})
	return response
}

export const fetchGetRanking = async (token: string | null) => {
	const response = await fetch(`http://localhost:${PORT}/api/ranking/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,

		}
	})
	return response
}