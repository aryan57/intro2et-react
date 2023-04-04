import React from "react"
import { Card, Button, Badge, Table, ListGroup } from 'react-bootstrap'

export const PostCard = ({ userName = "", postMediaURL = "", postDescription = "", timestamp = "", categoryName = "", latitude = "", longitude = "", postId = "",deleteHandler=null }) => {

	const dt = new Date(parseInt(timestamp) * 1000);
	let strTimestamp = dt.toLocaleTimeString('en-GB', {
		day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
	});
	if (!strTimestamp) strTimestamp = "";

	const strLocationLink = "https://maps.google.com/?q=" + latitude + "," + longitude

	return (
		<Card style={{ marginTop: "15px" }}>
			<Card.Header >
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<div>
						<h5>{userName}</h5>
					</div>

					<Button title="Delete this post" value={postId} onClick={deleteHandler} variant="outline-danger" size="sm" >
						X
					</Button>
				</div>
			</Card.Header>
			<Card.Img variant="top" src={postMediaURL} alt={"Error in retrieving " + userName + "'s photo"} />
			<ListGroup variant="flush">
				<ListGroup.Item><b>Description : </b>{postDescription}</ListGroup.Item>
				<ListGroup.Item><b>Category : </b>{categoryName}</ListGroup.Item>
				<ListGroup.Item><b>Location : </b><a href={strLocationLink}>({latitude},{longitude})</a></ListGroup.Item>
				<ListGroup.Item><b>Time : </b>{strTimestamp}</ListGroup.Item>
			</ListGroup>
		</Card>
	)
}