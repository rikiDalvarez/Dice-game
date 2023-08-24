import React, { useContext, useState } from 'react';
import Dashboard from './Dashboard';
import { UserContext } from './context/UserContext';
import { useNavigate } from 'react-router-dom';
const Login: React.FC = () => {

	interface DashboardProps {
		name: string | null;
	}

	const navigate = useNavigate();
	const userContext = useContext(UserContext);

	console.log(userContext)

	const [formData, setFormData] = useState({
		email: "",
		password: ""
	})

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const navigateRegistration = () => {
		navigate("/api/players")

	}

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
			console.log(response)

			if (response.ok) {
				const data = await response.json();
				const token = data.token;
				const nameUser = data.name;
				const tokenuser = localStorage.setItem("token", token)
				console.log(tokenuser)
				const name = localStorage.setItem("name", nameUser)
				console.log(name)
				userContext.setUser({
					email: formData.email,
					token: localStorage.getItem("token")
				});

				console.log("login successful")
				setIsLoggedIn(true)
				// navigate("/dashboard")

			} else {
				console.error("login failed")
			}
		} catch (error) {
			console.error("an error occurred:", error)
		}
	}

	const name = localStorage.getItem("name")

	return (
		<div className="min-h-screen flex items-center justify-center bg-color-movement ">
			<div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
				{isLoggedIn ? (<>

					<Dashboard name={name} />
				</>)
					: (<>
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
							<button
								// onClick={() => { navigate("/api/players") }}
								className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
								onClick={navigateRegistration}
							>
								Registration
							</button>
						</form>
					</>
					)}

			</div>
		</div>
	);
};

export default Login;
