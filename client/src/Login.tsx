import React from 'react';

const Login: React.FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold mb-4">Login</h2>
				<form>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
							Username
						</label>
						<input
							className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
							type="text"
							id="username"
							name="username"
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
