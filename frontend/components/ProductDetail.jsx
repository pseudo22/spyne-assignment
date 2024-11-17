import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosClient from '../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedCar } from '../features/carSlice'
import {FaTrash} from 'react-icons/fa'

export default function ProductDetail() {
  const { carId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const car = useSelector((state) => state.car.selectedCar)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedCar, setUpdatedCar] = useState({ ...car })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalImage, setModalImage] = useState(null)

  const [selectedImages, setSelectedImages] = useState([])
  const [deletedImages, setDeletedImages] = useState([])

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axiosClient.get(`/car/view/${carId}`)
        const carData = response?.data?.data
        dispatch(setSelectedCar(carData))
        setUpdatedCar(carData)
        setSelectedImages(carData?.images || [])
        setDeletedImages([])
      } catch (err) {
        setError(err?.response?.data?.message || 'Error fetching car details.')
      } finally {
        setLoading(false)
      }
    }

    fetchCarDetails()
  }, [carId, dispatch])

  const handleEdit = async () => {
    setLoading(true)
    const formData = new FormData()

    for (const key in updatedCar) {
      if (key !== 'images') {
        formData.append(key, updatedCar[key])
      }
    }

    selectedImages.forEach((image) => {
      formData.append('images', image)
    })

    deletedImages.forEach((url) => {
      formData.append('deleteUrls', url)
    })

    try {
      const response = await axiosClient.put(`/car/update/${carId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      dispatch(setSelectedCar(response?.data?.data))
      setIsEditing(false)
    } catch (err) {
      setError(err?.response?.data?.message || 'Error updating car details.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this car?')
    if (confirmDelete) {
      try {
        await axiosClient.delete(`/car/delete/${carId}`)
        dispatch(setSelectedCar(null))
        alert('Car deleted successfully')
        navigate('/car-list')
      } catch (err) {
        alert('Error deleting car')
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUpdatedCar((prevCar) => ({
      ...prevCar,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const files = e.target.files
    setSelectedImages((prevImages) => [...prevImages, ...Array.from(files)])
  }

  const handleImageRemove = (index, image) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index))
    if (!(image instanceof File)) {
      setDeletedImages((prevDeleted) => [...prevDeleted, image])
    }
  }

  const openModal = (image) => setModalImage(image)
  const closeModal = () => setModalImage(null)

  if (loading) return <p>Loading car details...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="p-6">
      {isEditing ? (
        <>
          <h2 className="text-2xl font-bold">Edit {updatedCar.carName || "Car"}</h2>
          <form>
            <div className="my-4">
              <label className="block mb-2">Car Name</label>
              <input
                type="text"
                name="carName"
                value={updatedCar.carName || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Repeat form fields similarly for description, type, dealer, etc. */}
            <div className="my-4">
              <label className="block mb-2">Images</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative w-full h-48">
                    <img
                      src={image instanceof File ? URL.createObjectURL(image) : image}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover rounded-md cursor-pointer"
                      onClick={() => openModal(image instanceof File ? URL.createObjectURL(image) : image)}
                    />
                    {image instanceof File ? null : (
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index, image)}
                        className="absolute top-0 right-0 text-red-500 p-1"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold">{updatedCar.carName}</h2>
          <p>Brand: {updatedCar.company}</p>
          {/* Image gallery section */}
          <div className="my-4">
            <label className="block mb-2">Images</label>
            <div className="grid grid-cols-3 gap-4">
              {updatedCar.images?.map((image, index) => (
                <div key={index} className="relative w-full h-48">
                  <img
                    src={image}
                    alt={`car-${index}`}
                    className="w-full h-full object-cover rounded-md cursor-pointer"
                    onClick={() => openModal(image)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </>
      )}

      <button
        onClick={() => navigate("/car-list")}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
      >
        Back to List
      </button>

      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-3xl">
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 text-black text-3xl"
            >
              X
            </button>
            <img
              src={modalImage}
              alt="Full-size"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
