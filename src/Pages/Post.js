import React, { useState, useRef, useEffect } from "react"
import Header from '../Utilities/Header'
import { Container, Table, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import PostCard from "../Utilities/PostCard"

export default function Post() {

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [postList, setPostList] = useState(null)


	const { getPosts } = useAuth()

	useEffect(() => {
		getPosts().then((lst) => {
			if(lst && lst.error)throw lst;
			setPostList(lst)
		}).catch(err=>{
			setError(err.message)
		})
	}, [])


	return (
		<>
			<Header />
			<Container className="d-flex align-items-center justify-content-center">
				<div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>

					<h2 className="text-center mb-4">Posts</h2>
					{error && <Alert variant="danger">{error}</Alert>}
					{success && <Alert variant="success">{success}</Alert>}

					<Table striped bordered hover responsive style={{ marginTop: 10 }}>
						<tbody>

							{
								postList &&
								postList.map((post) => (
									< tr key={post.id} >
										<td >
											<PostCard
												userName={post.email}
												postMediaURL={post.imgLink}
												postDescription={post.description}
												timestamp={post.unixTime}
											/>
										</td>
									</tr>
								))

							}


						</tbody>
					</Table>

				</div>
			</Container >
		</>
	)
}