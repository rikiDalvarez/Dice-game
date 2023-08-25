import { PORT } from "./config/config"

export interface FormData {
	email: string;
	password: string;
}

export interface RegistrationData {
	name: string;
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

export const fetchRegistration = async (data: RegistrationData) => {
	const response = await fetch(`http://localhost:${PORT}/api/players`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	return response
}

export const fetchToken = async (token: string | null) => {
	const response = await fetch(`http://localhost:${PORT}/api/players`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	return response;
}