import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  useEffect(()=>{
    if(!user) return;
    const delay=setTimeout(()=>{
        navigate(search.trim()?`/?search=${encodeURIComponent(search)}`:"/")
    },500)
    return ()=>clearTimeout(delay);
  },[search,navigate,user])
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };
  useEffect(()=>{
setSearch("")
  },[user])
  return (
    <nav className="bg-gray-900 p-4 text-white shadow-lg ">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/"> Notes App  </Link>
        
        {user && (
          <>
            <div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search a note.."
               className="w-full py-2 border border-gray-400 px-4 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 font-medium">{user.username}</span>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
