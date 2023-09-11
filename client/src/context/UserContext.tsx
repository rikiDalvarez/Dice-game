import React, { createContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import jwt_decode from "jwt-decode"


type AuthUser = {
	email: string;
	token?: string;
	id?: string;
}



export type UserContextType = {
	user: AuthUser | null;
	setUser: Dispatch<SetStateAction<AuthUser | null>>;
	isTokenValid: boolean
	setIsTokenValid: Dispatch<SetStateAction<boolean>>;
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
			setIsTokenValid(false)
			return
		}
		if (token) {
			const decodedToken: DecodedToken = jwt_decode(token)
			const currentDate = new Date();
			const tokenExpiration = decodedToken.exp ? decodedToken.exp : null;
			if(tokenExpiration){
			if (tokenExpiration * 1000 < currentDate.getTime()) {
				console.log("Token expired.");
				setIsTokenValid(false)
				localStorage.clear()
			} else {
				console.log("Valid token");
				setIsTokenValid(true)
				setUser({ email: "", token: token, id: decodedToken.userId })
			}
		}
		}

	}, [])

	return <UserContext.Provider value={{ user, setUser, isTokenValid, setIsTokenValid }}>{children}</UserContext.Provider>

};
