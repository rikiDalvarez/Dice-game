import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import auth from "./utils/auth"
import Navbar from "./Navbar"
import Dashboard from './Dashboard';


import './App.css';
// add context and react-router-dom // context provider
// useEffect

function App() {
	const initialState = auth.isAuthenticated();
	const [isAuthenticated, setIsAuthenticated] = useState(initialState);

	return (
		<div className="App">
			<Router>
				<Navbar isAuthenticated={isAuthenticated} />
				<Dashboard setIsAuthenticated={setIsAuthenticated} />
			</Router>
		</div>
	);
}

export default App;