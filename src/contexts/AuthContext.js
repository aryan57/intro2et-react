import React, { useContext, useState, createContext } from "react"
import axios from 'axios';


const AuthContext = createContext();

export const API_URL = 
	process.env.NODE_ENV === 'development' ?
	process.env.REACT_APP_DEV_API_URL : process.env.REACT_APP_PROD_API_URL


export const useAuth = () => {
	return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {

	const [authState, setAuthState] = useState(() => {
		const accessToken = localStorage.getItem('accessToken')
		const refreshToken = localStorage.getItem('refreshToken')
		const userEmail = localStorage.getItem('userEmail')
		const userName = localStorage.getItem('userName')
		if (accessToken && refreshToken && userEmail && userName) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
			return { accessToken: accessToken, refreshToken: refreshToken, authenticated: true, userEmail: userEmail, userName : userName}
		} else {
			return { accessToken: null, refreshToken: null, authenticated: null, userEmail: null , userName: null}
		}
	})


	const signup = async (name,email,password,role) => {
		try {
			const response = await axios.post(`${API_URL}/user/signup`, { email, password,name });
			if (response.status !== 200) {
				return { error: true, message: response.data }
			}
			return response
		} catch (err) {
			return { error: true, message: err.response.data.message }
		}
	}

	const submitScore = async (level, timetaken) => {
		try {
			const response = await axios.post(`${API_URL}/post/submitScore`, { level, timetaken });

			console.log(response);

			if (response.status !== 200) {
				return { error: true, message: response.data }
			}
			
			return response.data;

		} catch (err) {
			return { error: true, message: err.message }
		}
	}

	const getLeaderboard = async () => {
		try {
			const response = await axios.get(`${API_URL}/post/allscores`);


			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			
			return response.data;

		} catch (err) {
			return { error: true, message: JSON.stringify([err.response.data.message, "We have refreshed the token also, can you try again?"]) }
		}
	}

	const login = async (email, password) => {
		try {
			const response = await axios.post(`${API_URL}/user/login`, { email, password });

			console.log(response);

			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			

			axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.user.access_token}`
			localStorage.setItem('accessToken', response.data.user.access_token)
			localStorage.setItem('refreshToken', response.data.user.refresh_token)
			localStorage.setItem('userEmail', email)


			const whoami_response = await axios.get(`${API_URL}/user/whoami`);


			if (whoami_response.status !== 200) {
				return { error: true, message: whoami_response.data }
			}

			localStorage.setItem('userName', whoami_response.data.user.name)

			setAuthState({
				accessToken: response.data.user.access_token,
				refreshToken: response.data.user.refresh_token,
				authenticated: true,
				userEmail: email,
				userName: whoami_response.data.user.name
			})
			
			return response;

		} catch (err) {
			return { error: true, message: err.message }
		}
	}

	const whoami = async () => {
		try {
			const response = await axios.get(`${API_URL}/user/whoami`);


			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			
			return response.data.user;

		} catch (err) {
			return { error: true, message: JSON.stringify([err.response.data.message, "We have refreshed the token also, can you try again?"]) }
		}
	}

	const logout = async () => {
		try {
			setAuthState({
				accessToken: null,
				refreshToken: null,
				authenticated: null,
				userEmail: null,
				userName: null,
			})

			axios.defaults.headers.common['Authorization'] = ''
			localStorage.clear()
		} catch (err) {
			return { error: true, message: err.message }
		}
	}



	const value = {
		signup,
		login,
		logout,
		whoami,
		submitScore,
		authState,
		getLeaderboard
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}