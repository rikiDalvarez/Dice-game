import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode"


type AuthUser = {
	email: string;
	token?: string;
	id?: string;
}

export type UserContextType = {
	user: AuthUser | null;
	setUser: object;
	isTokenValid: boolean
};

type UserContextProviderType = {
	children: React.ReactNode
}

interface DecodedToken {
	userId: string;
	iat: number;
	exp: number;
}


export const UserContext = createContext({} as UserContextType)

export const UserContextProvider = ({ children }: UserContextProviderType) => {

	const [user, setUser] = useState<AuthUser | null>(null);
	const [isTokenValid, setIsTokenValid] = useState<boolean>(false)

	useEffect(() => {
		console.log("veryfing token")
		const token = localStorage.getItem("token")
		if (!token) {
			console.log("token not found")
			return
		}
		if (token) {
			const decodedToken: DecodedToken = jwt_decode(token)
			console.log("decodedTOKEN", decodedToken)
			const currentDate = new Date();
			if (decodedToken.exp * 1000 < currentDate.getTime()) {
				console.log("Token expired.");
				setIsTokenValid(false)
				localStorage.clear()
			} else {

				console.log("current time", currentDate.getTime())
				console.log("Valid token");
				setIsTokenValid(true)
				setUser({ email: "", token: token, id: decodedToken.userId })
			}
		}

	}, [])
	console.log("user", { user })

	return <UserContext.Provider value={{ user, setUser, isTokenValid }}>{children}</UserContext.Provider>

};
