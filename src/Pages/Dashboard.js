import React, { useState, useRef } from "react"
import { Header } from '../Utilities/Header'
import { Container, Table, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import { useGeolocated } from "react-geolocated";

export const Dashboard = () => {

  const [file, setFile] = useState(null)
  const [imgID, setImgID] = useState(null)
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

  const { createPost, uploadPostImage, predict, getNonTrainedCategories } = useAuth()

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
    setImgID(null)
    setPredictionList(null)
    setCategoryName(null)

    try {


      const imgID = await uploadPostImage(file);
      if (imgID && imgID.error) throw imgID

      setImgID(imgID)
      setSuccess("Image Upload Successfull!")

      /**
       
        let prediction_list = await predict(file);
        if (prediction_list && prediction_list.error) throw prediction_list

        predict api is not supported from backend api now,
        now, do local image classification, currently only in android app

        So, for now we have the prediction,list as a static list,
        and not according to the sorted of their probablities of their classes
       */
      let prediction_list = ['fallen-tree','garbage','pothole','road']

      const nonTrainedCategoriesArray = await getNonTrainedCategories()
      if (nonTrainedCategoriesArray && nonTrainedCategoriesArray.error) throw nonTrainedCategoriesArray

      // add the non ml trained categories in the end
      prediction_list = prediction_list.concat(nonTrainedCategoriesArray)

      setPredictionList(prediction_list)
      setCategoryName(prediction_list[0])
      setSuccess("Predictions accquired!")

    } catch (err) {
      setError(err.message)
      setImgID(null)
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

      const result = await createPost(descriptionRef.current.value, imgID, unixTime, location.longitude, location.latitude, categoryId)
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
                  {/* TODO : Add 64x640 cropping */}
                  <Form.Group controlId="formFile" >
                    <Form.Control 
                    type="file"
                    accept="image/*"
                    onChange={(e) => { setFile(e.target.files[0]) }}
                    label={file ? file.name : "Choose Picture"} />
                  </Form.Group>
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