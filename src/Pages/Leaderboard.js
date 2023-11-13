import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../Utilities/Header'
import '../css/style.css'


const Leaderboard = () => {


	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")


	const [leaderboardData, setLeaderboardData] = useState([]);
	const { getLeaderboard } = useAuth();


	useEffect(() => {
		const fetchLeaderboardData = async () => {
			try {
				const data = await getLeaderboard();
				console.log(data);
				setLeaderboardData(data.list || []);
			} catch (error) {
				console.error('Error fetching leaderboard data:', error);
			}
		};

		fetchLeaderboardData();
	}, [getLeaderboard]);

	return (

		<>
			<Header />
			<Container className="d-flex align-items-center justify-content-center">
				<div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>
					<h2 className="text-center mb-4">Leaderboard</h2>
					{error && <Alert variant="danger">{error}</Alert>}
					{success && <Alert variant="success">{success}</Alert>}

					<div>
						{/* <h1>Leaderboard</h1> */}
						<table striped bordered hover responsive style={{ marginTop: 10 }}>
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Email</th>
									<th>Level</th>
									<th>Time Taken</th>
								</tr>
							</thead>
							<tbody>
								{leaderboardData.map((entry) => (
									<tr key={entry.id} className="leaderboard-row">
										<td>{entry.id}</td>
										<td>{entry.name}</td>
										<td>{entry.email}</td>
										<td>{entry.level}</td>
										<td>{entry.timetaken}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>


				</div>
			</Container >
		</>
	);
};

export default Leaderboard;
