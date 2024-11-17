import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axiosClient from '../utils/axios.js'
import { setSearchResults } from '../features/carSlice' 

export default function GlobalSearch() {
  const dispatch = useDispatch()
  const searchResults = useSelector((state) => state.car.searchResults)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [sortOrder, setSortOrder] = useState('asc') 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  
  const fetchCars = async (searchKeyword = '', tag = '') => {
    setLoading(true)
    setError('')
    try {
        const response = await axiosClient.post('/car/search', {
            searchKeyword,
            selectedTag: tag,
        })

        let sortedResults = response?.data?.data ?? [] 

        if (sortOrder === 'asc') {
            sortedResults = sortedResults.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        } else {
            sortedResults = sortedResults.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        }

        dispatch(setSearchResults(sortedResults))
    } catch (err) {
        setError(err.response?.data?.message ?? 'Error fetching search results')
        dispatch(setSearchResults([])) 
    } finally {
        setLoading(false)
    }
}


  
  const handleSearch = () => {
    fetchCars(searchTerm, selectedTag)
  }

  
  useEffect(() => {
    if (searchTerm === '') {
      fetchCars() 
    }
  }, [searchTerm])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Global Car Search</h1>

      <input
        type="text"
        placeholder="Search by car name, description, or tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />

      <select
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      >
        <option value="">Filter by Tag</option>
        {['Petrol', 'Diesel', 'Electric', 'BMW', 'Mercedes'].map((tag) => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      >
        <option value="asc">Sort by Price: Low to High</option>
        <option value="desc">Sort by Price: High to Low</option>
      </select>

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Search
      </button>

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {searchResults.length === 0 && !loading ? (
        <p>No cars found matching the search criteria.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((car) => (
            <li
              key={car._id}
              className="border p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={car.images[0]}
                alt={car.carName}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="font-semibold text-xl mb-2">{car.carName}</h2>
              <p className="mb-2">Brand: {car.company}</p>
              <p className="mb-2">Price: ${car.price}</p>
              <p className="mb-2">Description: {car.description}</p>

              {/* Tags Section */}
              <div className="flex flex-wrap gap-2 mt-4">
                {car.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-blue-500 text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
