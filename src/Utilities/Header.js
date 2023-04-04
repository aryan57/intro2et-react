import React, { useState } from "react"
import { Button, Navbar, Alert, Nav } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"

export const Header = () => {
    const [error, setError] = useState("")
    const { logout, authState } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push("/login")
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Navbar bg="dark" variant="dark" expand="lg">
                {authState.userEmail && <Navbar.Brand href="/">Welcome, {authState.userEmail}</Navbar.Brand>}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav.Link href="/">Create Post</Nav.Link>
                    <Nav.Link href="/post">Posts</Nav.Link>
                    <Nav.Link href="/category">Categories</Nav.Link>
                    <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}