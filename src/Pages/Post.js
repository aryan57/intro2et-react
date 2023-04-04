import React, { useState, useRef, useEffect } from "react"
import { Header } from '../Utilities/Header'
import { Container, Table, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import { PostCard } from "../Utilities/PostCard"

export const Post = () => {

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [postList, setPostList] = useState(null)


	const { getPosts, deletePostById } = useAuth()

	useEffect(() => {
		getPosts().then((lst) => {
			if (lst && lst.error) throw lst;
			setPostList(lst)
		}).catch(err => {
			setError(err.message)
		})
	}, [])

	async function deletePost(e) {
		e.preventDefault()
		setLoading(true)
		setSuccess("")
		setError("")

		try {
			const postId = e.target.value;
			const result = await deletePostById(postId)
			if (result && result.error) throw result

			const lst = await getPosts()
			if (lst && lst.error) throw lst
			setPostList(lst)

			setSuccess(result)

		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}


	return (
		<>
			<Header />
			<Container className="d-flex align-items-center justify-content-center">
				<div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>

					<h2 className="text-center mb-4">Posts</h2>
					{error && <Alert variant="danger">{error}</Alert>}
					{success && <Alert variant="success">{success}</Alert>}
					{
						postList &&
						postList.map((post) => (

							<PostCard
								key={post.id}
								userName={post.email}
								postMediaURL={post.imgLink}
								postDescription={post.description}
								timestamp={post.unixTime}
								categoryName={post.categoryName}
								longitude={post.longitude}
								latitude={post.latitude}
								postId={post.id}
								deleteHandler={deletePost}
							/>
						))

					}
				</div>
			</Container >
		</>
	)
}