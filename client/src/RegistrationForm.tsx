import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRegistration } from './services';

const Registration: React.FC = () => {
	const navigate = useNavigate();
	const [registrationData, setRegistrationData] = useState({
		name: "",
		email: "",
		password: ""
	})

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setRegistrationData(prevData => ({
			...prevData, [name]: value
		}))
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		console.log('handleSubmit presssed')
		try {
			const response = await fetchRegistration(registrationData);
			if (response.ok) {
				const data = await response.json();
				console.log(data)
				navigate("/")

			} else {
				console.error("registration failed")
			}
		} catch (error) {
			console.error("an error occurred:", error)
		}
	}

	return (
		<div className="min-h-screen  flex items-center justify-center bg-color-movement ">

			<div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Registration form</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
							name
						</label>
						<input
							className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
							type="text"
							id="name"
							name="name"
							value={registrationData.name}
							onChange={handleChange}
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
							email
						</label>
						<input
							className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
							type="text"
							id="email"
							name="email"
							value={registrationData.email}
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
							value={registrationData.password}
							onChange={handleChange}
						/>
					</div>

					<button
						className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
						type="submit"
						onClick={handleSubmit}
					>
						Registrate
					</button>
				</form>
			</div>
		</div>
	);
};

export default Registration;
