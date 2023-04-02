import React, { useState, useRef } from "react"
import Header from '../Widgets/Header'
import { Container, Table, ProgressBar, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"

export default function Grid() {

  const [uploadProgress, setUploadProgress] = useState(0)
  const [file, setFile] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const captionRef = useRef()

  const { createPost
  } = useAuth()

  async function uploadNewPost_() {

    if (!file || file.type.lastIndexOf('/') < 0) {
      setError("Please select a valid image")
      return
    }

    if (file.size > 10 * 1000000) {
      setError("Sorry, file size more than 10 MB")
      return;
    }

    setLoading(true)
    setSuccess("")
    setError("")
    setUploadProgress(0);

    // todo upload image in bucket

  }


  return (
    <>
      <Header />
      <Container className="d-flex align-items-center justify-content-center">
        <div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>

          <h2 className="text-center mb-4">Create Post</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Table striped bordered hover responsive style={{ marginTop: 10 }}>
            <tbody>
              <tr>
                <td>
                  <ProgressBar animated now={uploadProgress} label={`${uploadProgress}%`} />
                </td>
              </tr>
              <tr>
                <td>
                  <Form>
                    <Form.File
                      accept="image/*"
                      label={file ? file.name : "Choose Picture"}
                      custom
                      onChange={(e) => { setFile(e.target.files[0]) }}
                    />
                  </Form>
                </td>
              </tr>
              <tr>
                <td>
                  <InputGroup>
                    <FormControl ref={captionRef} placeholder="Description (Optional)" />
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <Button disabled={loading} className="w-100" onClick={uploadNewPost_}>
                    Add New Post
                  </Button>
                </td>
              </tr>

            </tbody>
          </Table>






        </div>
      </Container>
    </>
  )
}