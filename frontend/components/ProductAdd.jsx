import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axios.js'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

export default function AddCar() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    carName: '',
    description: '',
    company: '',
    carType: 'Petrol',
    dealer: '',
    images: [],
    color: '',
    mileage: '',
    year: '',
    price: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        images: [...files],
      }));
    } else {
      setError('Cannot add more than 10 images');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError('');
    setLoading(true); 
    setSuccess(false); 
  
    const formDataToSend = new FormData();
  
    for (const key in formData) {
      if (key !== 'images') {
        formDataToSend.append(key, formData[key]);
      }
    }
  
    for (let i = 0; i < formData.images.length; i++) {
      formDataToSend.append('images', formData.images[i]);
    }
  
    try {
      const response = await axiosClient.post('/car/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      toast.success(response?.data?.message); // Optional chaining for response data
      setSuccess(true); 
  
      setTimeout(() => {
        navigate('/car-list');
      }, 3000); 
  
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Something went wrong!'; // Safe access with optional chaining
      setError(errorMessage); // Set error message from response or default
      console.log(err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Add a New Car</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {loading && !success && (
          <div className="text-blue-500 text-center mb-4">Registering your car...</div>
        )}
        {success && (
          <div className="text-green-500 text-center mb-4">Car registered successfully!</div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Car Name */}
          <div className="flex flex-col">
            <label htmlFor="carName" className="text-sm font-medium text-gray-700">Car Name</label>
            <input
              type="text"
              id="carName"
              name="carName"
              value={formData.carName}
              onChange={handleChange}
              required
              className="p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Company */}
          <div className="flex flex-col">
            <label htmlFor="company" className="text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Car Type */}
          <div className="flex flex-col">
            <label htmlFor="carType" className="text-sm font-medium text-gray-700">Car Type</label>
            <select
              id="carType"
              name="carType"
              value={formData.carType}
              onChange={handleChange}
              required
              className="p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label htmlFor="price" className="text-sm font-medium text-gray-700">Price</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Dealer */}
          <div className="flex flex-col">
            <label htmlFor="dealer" className="text-sm font-medium text-gray-700">Dealer</label>
            <input
              type="text"
              id="dealer"
              name="dealer"
              value={formData.dealer}
              onChange={handleChange}
              className="p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col col-span-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Car Images */}
          <div className="flex flex-col col-span-2">
            <label htmlFor="images" className="text-sm font-medium text-gray-700">Car Images (max 10)</label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
              className="p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Year */}
          <div className="flex flex-col">
            <label htmlFor="year" className="text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Color */}
          <div className="flex flex-col">
            <label htmlFor="color" className="text-sm font-medium text-gray-700">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Mileage */}
          <div className="flex flex-col">
            <label htmlFor="mileage" className="text-sm font-medium text-gray-700">Mileage</label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto mt-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
