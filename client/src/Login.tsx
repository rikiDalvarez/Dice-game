import React, { useState } from 'react';

const Login: React.FC = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	})

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData(prevData => ({
			...prevData, [name]: value
		}))
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			const response = await fetch("http://localhost:5000/api/login", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			})

			if (response.ok) {
				const data = await response.json();
				const token = data.token;

				localStorage.setItem("token", token)
				console.log("login successful")
			} else {
				console.error("login failed")
			}
		} catch (error) {
			console.error("an error occurred:", error)
		}
	}



	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 ">
			<div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Login</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
							email
						</label>
						<input
							className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
							type="text"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
						/>
					</div>
					<div className="mb-6">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
							Password
						</label>
						<input
							className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
						/>
					</div>
					<button
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
						type="submit"
					>
						Log In
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
