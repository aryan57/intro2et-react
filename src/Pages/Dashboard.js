import React, { useState, useRef } from "react"
import { Header } from '../Utilities/Header'
import { Container, Table, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import { useGeolocated } from "react-geolocated";

export const Dashboard = () => {

  const [file, setFile] = useState(null)
  const [imgPublicUrl, setImgPublicUrl] = useState(null)
  const [predictionList, setPredictionList] = useState(null)
  const [categoryName, setCategoryName] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const descriptionRef = useRef()
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 5000,
    });

  const { createPost, whoami, uploadPostImage, predict, updateCategoryMappings } = useAuth()

  const handleCategoryChange = (event) => {
    setCategoryName(event.target.value)
  }

  async function uploadImageAndGetData() {

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
      if (public_url && public_url.error) throw public_url

      setImgPublicUrl(public_url)
      setSuccess("Image Upload Successfull!")

      const prediction_list = await predict(file);
      if (prediction_list && prediction_list.error) throw prediction_list

      setPredictionList(prediction_list)
      setCategoryName(prediction_list[0])
      setSuccess("Predictions accquired!")

    } catch (err) {
      setError(err.message)
      setImgPublicUrl(null)
      setPredictionList(null)
      setCategoryName(null)
    } finally {
      setLoading(false)
    }

  }

  async function uploadNewPost() {

    if (!categoryName) {
      setError("Please upload an image first")
      return
    }

    setLoading(true)
    setSuccess("")
    setError("")

    try {


      const nameToIdMap = JSON.parse(localStorage.getItem('categoryMapping_nameToIdMap'))
      if (!nameToIdMap) throw { message: "Mapping not found" }
      const categoryId = nameToIdMap[categoryName]
      if (!categoryId) throw { message: `categoryId for ${categoryName} not found` }

      let location = {
        latitude: 0,
        longitude: 0
      };

      if (isGeolocationAvailable && isGeolocationEnabled && coords) {
        location = {
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      }

      const unixTime = Math.floor(Date.now() / 1000);

      const result = await createPost(descriptionRef.current.value, imgPublicUrl, unixTime, location.longitude, location.latitude, categoryId)
      if (result && result.error) throw result
      setSuccess(result)
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
                <tr >
                  <td colSpan={2}>
                    <Form>

                      <div key={`inline-checkbox`} className="" style={{ height: '100px', overflowY: 'scroll' }}>
                        {predictionList.map((predictionCategory) => (
                          <Form.Check

                            label={predictionCategory}
                            value={predictionCategory}
                            key={predictionCategory}
                            name="group1"
                            type="radio"
                            id={`inline-checkbox-${predictionCategory}`}
                            checked={categoryName === predictionCategory}
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
                <td>
                  <Button disabled={loading} className="w-10" onClick={uploadImageAndGetData}>
                    Upload
                  </Button>
                </td>
              </tr>
              <tr>
                <td colSpan={2}  >
                  <InputGroup >
                    <FormControl type="text" ref={descriptionRef} placeholder="Description (Optional)" />
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <Button disabled={loading} className="w-100" onClick={uploadNewPost}>
                    Add New Post
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Container >
    </>
  )
}