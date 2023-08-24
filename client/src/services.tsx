import { PORT } from "./config/config"

export async function fetchLogin(data: unknown) {
	const response = await fetch(`http://localhost:${PORT}/api/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	console.log(response)
	return response
}
