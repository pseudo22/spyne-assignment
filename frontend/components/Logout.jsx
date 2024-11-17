import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/userSlice.js'; 
import axiosClient from '../utils/axios.js';

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const handleLogout = async () => {
      try {
        await axiosClient.post('/user/logout');
        dispatch(logout()); 
        navigate('/login'); 
      } catch (error) {
        const errorMessage = error?.response?.data?.message ?? 'Logout failed, please try again';
        console.error(errorMessage); // Log the error message for debugging
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };
  
    return (
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
      >
        Logout
      </button>
    );
  };
  

export default Logout;
