import React, { useState } from "react"
import { Button, Navbar, Alert, Nav, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export const Header = () => {
    const [error, setError] = useState("")
    const { logout, authState } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            navigate("/login")
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                <Container fluid>
                    <Navbar.Brand href="/">Welcome, {authState.userEmail ? authState.userEmail : 'Unknown userEmail'}</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav navbarScroll>
                            <Nav.Link href="/">Create Post</Nav.Link>
                            <Nav.Link href="/post">Posts</Nav.Link>
                            <Nav.Link href="/mapView">MapView</Nav.Link>
                            <Nav.Link href="/category">Categories</Nav.Link>
                            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}