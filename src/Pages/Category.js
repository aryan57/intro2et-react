import React, { useState, useRef, useEffect } from "react"
import Header from '../Utilities/Header'
import { Container, Table, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"

export default function Category() {

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const categoryRef = useRef()
	const [categoryList, setCategoryList] = useState(null)


	const { createCategory, updateCategoryMappings, getCategories, deleteCategoryById } = useAuth()

	useEffect(() => {
		updateCategoryMappings().then((arr) => {
			if (arr && arr.error) throw arr;
			return getCategories()
		}).then((lst) => {
			if (lst && lst.error) throw lst;
			setCategoryList(lst)
		}).catch(err => {
			setError(err.message)
		})
	}, [])

	async function createNewCategory() {

		if (!categoryRef.current.value) {
			setError("Category name can't be empty")
			return
		}

		setLoading(true)
		setSuccess("")
		setError("")

		try {

			const createCategoryResult = await createCategory(categoryRef.current.value)
			if (createCategoryResult && createCategoryResult.error) throw createCategoryResult

			const result = await updateCategoryMappings()
			if (result && result.error) throw result

			const lst = await getCategories()
			setCategoryList(lst)
			setSuccess(createCategoryResult)

		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
			categoryRef.current.value = ""
		}
	}

	async function deleteCategory(e) {
		e.preventDefault()
		setLoading(true)
		setSuccess("")
		setError("")

		try {
			const categoryName = e.target.value;
			console.log(categoryName)
			const nameToIdMap = JSON.parse(localStorage.getItem('categoryMapping_nameToIdMap'))
			if (!nameToIdMap) throw { message: "Mapping not found" }
			const categoryId = nameToIdMap[categoryName]
			console.log(nameToIdMap, categoryName, nameToIdMap[categoryName]);
			if (!categoryId) throw { message: `categoryId for ${categoryName} not found` }
			const result = await deleteCategoryById(categoryId)
			if (result && result.error) throw result
			
			const arr = await updateCategoryMappings()
			if (arr && arr.error) throw arr
			
			const  lst = await getCategories()
			setCategoryList(lst)

			setSuccess(result)

		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Header />
			<Container className="d-flex align-items-center justify-content-center">
				<div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>

					<h2 className="text-center mb-4">Categories</h2>
					{error && <Alert variant="danger">{error}</Alert>}
					{success && <Alert variant="success">{success}</Alert>}

					<Table striped bordered hover responsive style={{ marginTop: 10 }}>
						<tbody>
							<tr>
								<td style={{ width: '450px' }} >
									<InputGroup >
										<FormControl type="text" ref={categoryRef} placeholder="New Category Name" />
									</InputGroup>
								</td>
								<td>
									<Button disabled={loading} onClick={createNewCategory}>
										Add
									</Button>
								</td>
							</tr>
							{
								categoryList &&

								categoryList.map((category) => (
									<tr key={category}>
										<td >
											{category}
										</td>
										<td>
											<div style={{ display: 'flex', justifyContent: 'center' }}>
												<Button  value={category} onClick={deleteCategory} variant="outline-danger" size="sm" >
													X
												</Button>
											</div>
										</td>
									</tr>
								))

							}


						</tbody>
					</Table>

				</div>
			</Container >
		</>
	)
}