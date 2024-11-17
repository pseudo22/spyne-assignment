import React from "react";
import { useLocation, Link } from "react-router-dom";
import Logout from "./Logout";

const Navbar = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup"]

  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="flex space-x-4">
        <Link to="/car-list" className="hover:text-gray-300">
          Product List
        </Link>
        <Link to="/add-car" className="hover:text-gray-300">
          Add Car
        </Link>
        <Link to="/global-search" className="hover:text-gray-300">
          Global Search
        </Link>
      </div>
      <Logout />
    </nav>
  );
};

export default Navbar;
