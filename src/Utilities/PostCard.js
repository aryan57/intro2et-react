import React from "react"
import { Card, Button, Badge } from 'react-bootstrap'

export const PostCard = ({ userName = "", postMediaURL = "", postDescription = "", timestamp = "" }) => {

	const dt = new Date(parseInt(timestamp)*1000);
	let str = dt.toLocaleTimeString('en-GB', {
		day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
	});
	if (!str) str = "";

	return (
		<Card style={{ marginTop: "15px" }}>
			<Card.Header >
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<div>
						<h5>{userName}</h5>
					</div>
					<div>
						{str}
					</div>
				</div>
			</Card.Header>
			<Card.Img variant="top" src={postMediaURL} alt={"Error in retrieving " + userName + "'s photo"} />
			<Card.Body>
				<Card.Text>
					{postDescription}
				</Card.Text>
			</Card.Body>
		</Card>
	)
}