import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container, ButtonGroup, ToggleButton } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export const Signup = () => {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const roles = [
    { name: 'User', value: 'USER' },
    { name: 'Admin', value: 'ADMIN' },];

  const [roleValue, setRoleValue] = useState('USER');

  async function handleSubmit(e) {
    e.preventDefault()

    setError("")
    setLoading(true)
    const result = await signup(nameRef.current.value, emailRef.current.value, passwordRef.current.value, roleValue)
    if (result && result.error) {
      setError(result.message)
    } else {
      navigate("/")
    }
    setLoading(false)
  }



  return (
    <>

      <Container className="d-flex align-items-center justify-content-center">
        <div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>

              <Form.Group id="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control ref={nameRef} required />
                </Form.Group>
                
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>

                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>

                <Form.Group id="role" className="mt-2 mb-4" >
                  <Form.Label>Role</Form.Label>
                  <ButtonGroup style={{ display: 'flex', justifyContent: 'center' }}>
                    {roles.map((role, idx) => (
                      <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant='outline-secondary'
                        name="radio"
                        value={role.value}
                        checked={roleValue === role.value}
                        onChange={(e) => setRoleValue(e.currentTarget.value)}
                      >
                        {role.name}
                      </ToggleButton>
                    ))}
                  </ButtonGroup>
                </Form.Group>

                <Button disabled={loading} className="w-100" type="submit">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </Container>
    </>
  )
}
