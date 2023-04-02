import React, { useContext, useState, useEffect,createContext } from "react"
import axios from 'axios';


const AuthContext = createContext();
export const API_URL = 'https://btp-backend-flask-inpm4aannq-el.a.run.app/api/v1'

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {

	const [authState, setAuthState] = useState(()=>{
		const accessToken = localStorage.getItem('accessToken')
		const refreshToken = localStorage.getItem('refreshToken')
		if(accessToken &&  refreshToken){
			axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
			return {accessToken:accessToken,refreshToken:refreshToken,authenticated:true}
		}else{
			return {accessToken:null,refreshToken:null,authenticated:null}
		}
	})


	const signup = async(email,password)=>{
		try {
			const response =  await axios.post(`${API_URL}/user/signup`,{email,password});
			if(response.status!==200){
				return {error:true,message: toString(response.message)}
			}
			
			if(response.data.success!==true){
				return {error:true,message: response.data.message}
			}

			return response
		} catch (err) {
			return {error:true,message: toString(err)}
		}
	}

	const login = async(email,password)=>{
		try {
			const response = await axios.post(`${API_URL}/user/login`,{email,password});

			if(response.status!==200){
				return {error:true,message: toString(response.message)}
			}
			
			if(response.data.success!==true){
				return {error:true,message: response.data.message}
			}
			
			setAuthState({
				accessToken:response.data.user.access_token,
				refreshToken:response.data.user.refresh_token,
				authenticated: true,
			})

			axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.user.access_token}`
			localStorage.setItem('accessToken',response.data.user.access_token)
			localStorage.setItem('refreshToken',response.data.user.refresh_token)

			return response;

		} catch (err) {
			return {error:true,message: toString(err)}
		}
	}

	const createPost = async(description,imgLink,unixTime,longitude,latitude,categoryId)=>{
		try {
			const response = await axios.post(`${API_URL}/post/createPost`,{description,imgLink,unixTime,longitude,latitude,categoryId});

			if(response.status!==200){
				return {error:true,message: toString(response.message)}
			}
			
			if(response.data.success!==true){
				return {error:true,message: response.data.message}
			}

			return response;

		} catch (err) {
			return {error:true,message: toString(err)}
		}
	}

	const logout = async()=>{
		try {
			setAuthState({
				accessToken:null,
				refreshToken:null,
				authenticated: null,
			})

			axios.defaults.headers.common['Authorization'] = ''
			localStorage.removeItem('accessToken')
			localStorage.removeItem('refreshToken')
		} catch (err) {
			return {error:true,message: toString(err)}
		}
	}

  const value = {
	signup,
    login,
    logout,
	createPost,
	authState
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}