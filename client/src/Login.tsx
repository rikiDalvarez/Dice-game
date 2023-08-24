import React, { useContext, useState } from 'react';
import Dashboard from './Dashboard';
import { UserContext } from './context/UserContext';
import { useNavigate } from 'react-router-dom';
import { fetchLogin } from './services';

const Login: React.FC = () => {

	// const baseUrl = process.env.PORT;
	// console.log(baseUrl)


	const navigate = useNavigate();
	const userContext = useContext(UserContext);

	console.log(userContext)

	const [formData, setFormData] = useState({
		email: "",
		password: ""
	})

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	
	const navigateRegistration = ( )=>{
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
			const response = await fetchLogin(formData)

			if (response.ok) {
				const data = await response.json();
				const token = data.token;
				localStorage.setItem("token", token)
				userContext.setUser({
					email: formData.email,
					token: localStorage.getItem("token")
				})

				console.log("login successful")
				setIsLoggedIn(true)
				navigate("/dashboard")

			} else {
				console.error("login failed")
			}
		} catch (error) {
			console.error("an error occurred:", error)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-color-movement ">
			<div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
				{isLoggedIn ? (<>

					<Dashboard />
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
