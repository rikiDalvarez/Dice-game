import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode"


type AuthUser = {
	email: string;
	token?: string;
	id?: string;
}

export type UserContextType = {
	user: any;
	setUser: any
};

type UserContextProviderType = {
	children: React.ReactNode
}


export const UserContext = createContext({} as UserContextType)

export const UserContextProvider = ({ children }: UserContextProviderType) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	useEffect(() => {
		console.log("veryfing token")
		const token = localStorage.getItem("token")
		if (!token) {
			console.log("token not found")
			return
		}
		if (token) {
			const decodedToken = jwt_decode(token)
			console.log("decodedTOKEN", decodedToken)
			const currentDate = new Date();
			if (decodedToken.exp * 1000 < currentDate.getTime()) {
				console.log("Token expired.");
				localStorage.clear()
			} else {
				console.log("Valid token");
				const decodedToken = jwt_decode(token)
				console.log("decodedTOKEN123", decodedToken)
				setUser({ email: "", token: token, id: decodedToken.userId })
			}
		}

	}, [])

	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>

};
