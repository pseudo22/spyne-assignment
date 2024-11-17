import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchResults, setCars, setSelectedCar } from '../features/carSlice';
import axiosClient from '../utils/axios.js';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {
  const dispatch = useDispatch();
  const cars = useSelector((state) => state.car.cars) ?? [];
  const searchResults = useSelector((state) => state.car.searchResults) ?? [];
  const user = useSelector((state) => state.user) ?? {};
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const [uniqueTags, setUniqueTags] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosClient.get('/car/list');
        if (response?.data?.data) {
          dispatch(setCars(response.data.data));
          dispatch(setSearchResults(response.data.data)); 

          
          const tags = response.data.data.reduce((acc, car) => {
            car.tags.forEach(tag => {
              if (!acc.includes(tag)) {
                acc.push(tag);
              }
            });
            return acc;
          }, []);
          
          setUniqueTags(tags); 
        } else {
          setError('No cars found.');
        }
      } catch (err) {
        setError(err?.response?.data?.message ?? 'Error fetching cars.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.user) {
      fetchCars();
    }
  }, [user?.user, dispatch]);

  useEffect(() => {
    
    const filteredResults = cars.filter(
      (car) =>
        (searchTerm ? car.carName.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
        (selectedTag ? car.tags.includes(selectedTag) : true)
    );

    
    const sortedResults = filteredResults.sort((a, b) => {
      if (sortOrder === 'asc') {
        return parseFloat(a.price) - parseFloat(b.price); 
      } else {
        return parseFloat(b.price) - parseFloat(a.price); 
      }
    });

    dispatch(setSearchResults(sortedResults)); 
  }, [searchTerm, selectedTag, sortOrder, cars, dispatch]);

  const handleViewCarDetail = async (carId) => {
    try {
      const car = cars.find((car) => car._id === carId);
      dispatch(setSelectedCar(car));
      navigate(`/car-detail/${carId}`);
    } catch (err) {
      setError('Error fetching car details.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cars</h1>

      
      <button
        onClick={() => navigate('/add-car')}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        Add New Car
      </button>

      
      <input
        type="text"
        placeholder="Search by car name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />

      
      <select
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      >
        <option value="">Filter by Tag</option>
        {uniqueTags.map((tag, index) => (
          <option key={index} value={tag}>
            {tag}
          </option>
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

      {loading && <p>Loading cars...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {searchResults.length === 0 && !loading ? (
        <p>No cars found. You can add new cars by clicking the "Add Car" button.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((car) => (
            <li
              key={car._id}
              className="border p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => handleViewCarDetail(car._id)}
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
  );
}
