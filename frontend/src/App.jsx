import React from 'react';
import './index.css'
import Navbar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import './App.css'

function App() {
  return (
    <div>
    <Navbar />
      <main className="p-4">
        <Outlet /> 
      </main>
    </div>
  );
}

export default App;
