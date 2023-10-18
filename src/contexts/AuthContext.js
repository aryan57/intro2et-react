import React, { useContext, useState, createContext } from "react"
import axios from 'axios';


const AuthContext = createContext();
// export const API_URL = 'https://btp-backend-flask-inpm4aannq-el.a.run.app/api/v1'
export const API_URL = 'http://localhost:8756/api/v1'

export const useAuth = () => {
	return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {

	const [authState, setAuthState] = useState(() => {
		const accessToken = localStorage.getItem('accessToken')
		const refreshToken = localStorage.getItem('refreshToken')
		const userEmail = localStorage.getItem('userEmail')
		if (accessToken && refreshToken && userEmail) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
			return { accessToken: accessToken, refreshToken: refreshToken, authenticated: true, userEmail: userEmail }
		} else {
			return { accessToken: null, refreshToken: null, authenticated: null, userEmail: null }
		}
	})


	const signup = async (name,email,password,role) => {
		try {
			const response = await axios.post(`${API_URL}/user/signup`, { email, password,role,name });
			if (response.status !== 200) {
				return { error: true, message: response.data }
			}
			return response
		} catch (err) {
			return { error: true, message: err.response.data.message }
		}
	}

	const updateCategoryMappings = async () => {
		try {
			const response = await axios.get(`${API_URL}/category/allCategories`);
			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			
			let nameToIdMap = {}
			let idToNameMap = {}
			let nonTrainedCategoriesArray = []
			let arr = response.data.list
			for (let i = 0; i < arr.length; i++) {
				nameToIdMap[arr[i]['categoryName']] = arr[i]['id']
				idToNameMap[arr[i]['id']] = arr[i]['categoryName']
				if(!arr[i]['isTrained'])
					nonTrainedCategoriesArray.push(arr[i]['categoryName'])
			}
			localStorage.setItem('categoryMapping_nameToIdMap', JSON.stringify(nameToIdMap))
			localStorage.setItem('categoryMapping_idToNameMap', JSON.stringify(idToNameMap))
			localStorage.setItem('nonTrainedCategoriesArray', JSON.stringify(nonTrainedCategoriesArray))
			return arr

		} catch (err) {
			await refresh()
			return { error: true, message: JSON.stringify([err.response.data.message, "We have refreshed the token also, can you try again?"]) }
		}
	}

	const getPosts = async () => {
		try {
			const response = await axios.get(`${API_URL}/post/allPosts`);
			
			return response.data.list

		} catch (err) {
			await refresh()
			return { error: true, message: JSON.stringify([err.response.data.message, "We have refreshed the token also, can you try again?"]) }
		}
	}

	const deleteCategoryById = async (categoryId) => {
		try {
			const response = await axios.delete(`${API_URL}/category/deleteCategory/${categoryId}`);
			return response.data.message

		} catch (err) {
			if(err.response.status === 401) { // when token expires we always get 401 Unauthorized status code
				console.log('token expired refreshing it...');
				const refreshResponse = await refresh()
				if(refreshResponse.status===200){
					console.log('refresh successfull, now calling the function again');
					return deleteCategoryById(categoryId)
				}
				else {
					console.log('refresh NOT successfull, logging out...');
					return await logout();
				}
			}
			
			return { error: true, message: JSON.stringify(err.response.data.message) }
		}
	}
	const deletePostById = async (postId) => {
		try {
			const response = await axios.delete(`${API_URL}/post/deletePost/${postId}`);
			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			

			return response.data.message

		} catch (err) {
			await refresh()
			return { error: true, message: JSON.stringify([err.response.data.message, "We have refreshed the token also, can you try again?"]) }
		}
	}

	const getAllCategories = async () => {
		try {
			const str = localStorage.getItem('categoryMapping_idToNameMap')
			if(!str)return { error: true, message: 'categoryMapping_idToNameMap not found in local storage' }
			const map = new Map(Object.entries(JSON.parse(str)));
			if(!map)return { error: true, message: 'error in parsing the list' }
			let lst = []
			for (const entry of map.entries()) {
				lst.push(entry[1]);
			}
			return lst
		} catch (err) {
			return { error: true, message: err.message }
		}
	}
	const getNonTrainedCategories = async () => {
		try {
			const str = localStorage.getItem('nonTrainedCategoriesArray')
			if(!str)return { error: true, message: 'nonTrainedCategoriesArray not found in local storage' }
			const lst = JSON.parse(str);
			if(!lst)return { error: true, message: 'error in parsing the list' }
			
			return lst
		} catch (err) {
			return { error: true, message: err.message }
		}
	}

	const login = async (email, password) => {
		try {
			const response = await axios.post(`${API_URL}/user/login`, { email, password });

			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			setAuthState({
				accessToken: response.data.user.access_token,
				refreshToken: response.data.user.refresh_token,
				authenticated: true,
				userEmail: email,
			})

			axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.user.access_token}`
			localStorage.setItem('accessToken', response.data.user.access_token)
			localStorage.setItem('refreshToken', response.data.user.refresh_token)
			localStorage.setItem('userEmail', email)
			
			await updateCategoryMappings()
			return response;

		} catch (err) {
			return { error: true, message: err.message }
		}
	}

	const refresh = async () => {
		try {
			const refreshToken = localStorage.getItem('refreshToken')
			const userEmail = localStorage.getItem('userEmail')

			if (!refreshToken || !userEmail) throw { error: true, message: "refresh token not found" }

			axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`


			const response = await axios.post(`${API_URL}/user/refresh`);

			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			

			setAuthState({
				accessToken: response.data.user.access_token,
				refreshToken: refreshToken,
				authenticated: true,
				userEmail: userEmail,
			})

			axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.user.access_token}`
			localStorage.setItem('accessToken', response.data.user.access_token)

			return response;

		} catch (err) {
			// there is an error in refresh also, so logout
			await logout()
			return { error: true, message: err.message }
		}
	}

	const createPost = async (description, imgID, unixTime, longitude, latitude, categoryId) => {
		try {
			const response = await axios.post(`${API_URL}/post/createPost`, { description, imgID, unixTime, longitude, latitude, categoryId });

			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			

			return response.data.message;

		} catch (err) {
			await refresh()
			return { error: true, message: JSON.stringify([err.response.data.message, "We have refreshed the token also, can you try again?"]) }
		}
	}

	const uploadPostImage = async (img) => {
		try {
			let formdata = new FormData();
			formdata.append("file", img, img.name);

			const response = await axios.post(`${API_URL}/post/uploadPostImage`, formdata);

			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			return response.data.imgID;

		} catch (err) {
			await refresh()
			return { error: true, message: JSON.stringify([err.response.data.message, "We have refreshed the token also, can you try again?"]) }
		}
	}

	const getImgUrl =  (imgID) => {
		return `${API_URL}/post/getPostImage/${imgID}`
	}

	const whoami = async () => {
		try {
			const response = await axios.get(`${API_URL}/user/whoami`);


			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			
			return response.data.user;

		} catch (err) {
			await refresh()
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
			})

			axios.defaults.headers.common['Authorization'] = ''
			localStorage.clear()
		} catch (err) {
			return { error: true, message: err.message }
		}
	}

	const createCategory = async (categoryName) => {
		try {

			const response = await axios.post(`${API_URL}/category/createCategory`, { categoryName });
			
			if (response.status !== 200) {
				return { error: true, message: response.data }
			}

			return response.data.message;

		} catch (err) {
			await refresh()
			return { error: true, message: JSON.stringify([err.response.data.message, "We have refreshed the token also, can you try again?"]) }
		}
	}



	const value = {
		signup,
		login,
		logout,
		createPost,
		whoami,
		uploadPostImage,
		getImgUrl,
		updateCategoryMappings,
		createCategory,
		getAllCategories,
		getNonTrainedCategories,
		getPosts,
		deleteCategoryById,
		deletePostById,
		authState
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}