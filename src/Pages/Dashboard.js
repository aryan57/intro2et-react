import React, { useState, useRef } from "react"
import Header from '../Utilities/Header'
import { Container, Table, ProgressBar, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"

export default function Dashboard() {

  const [file, setFile] = useState(null)
  const [imgPublicUrl, setImgPublicUrl] = useState(null)
  const [predictionList, setPredictionList] = useState(null)
  const [categoryName, setCategoryName] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const descriptionRef = useRef()

  const { createPost, whoami, uploadPostImage, predict, updateCategoryMappings } = useAuth()

  const handleCategoryChange = (event) => {
    setCategoryName(event.target.value)
  }

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
    setImgPublicUrl(null)
    setPredictionList(null)
    setCategoryName(null)

    try {


      const public_url = await uploadPostImage(file);
      if (public_url && public_url.error)throw public_url

      setImgPublicUrl(public_url)
      setSuccess("Image Upload Successfull!")

      const prediction_list = await predict(file);
      if (prediction_list && prediction_list.error)throw prediction_list

      setPredictionList(prediction_list)
      setCategoryName(prediction_list[0])
      setSuccess("Predictions accquired!")
      

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      descriptionRef.current.value = ""
    }

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
              {
                predictionList && 
                <tr>
                <td>
                  <Form>
                    
                      <div key={`inline-checkbox`} className="">
                      {predictionList.map((predictionCategory) => (
                        <Form.Check
                          label={predictionCategory}
                          value={predictionCategory}
                          name="group1"
                          type="radio"
                          id={`inline-checkbox-${predictionCategory}`}
                          checked={categoryName===predictionCategory}
                          onChange={handleCategoryChange}
                        />
                      ))}
                      </div>
                    
                  </Form>
                </td>
              </tr>
              }
              
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
                    <FormControl ref={descriptionRef} placeholder="Description (Optional)" />
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