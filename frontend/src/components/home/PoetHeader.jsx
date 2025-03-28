import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaMicrophone } from "react-icons/fa"; 
import h1 from "../../assets/logoHead.jpg";
import Profile from "./profile";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="bg-gray-900 p-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="relative bg-purple-900 flex items-center">
        <Link to="/home">
          <img src={h1} alt="HarfZaar Logo" className="h-12" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden sm:flex space-x-6 text-white">
        {["Poets", "News", "Qaafia", "Contests", "Bazm"].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className="relative group hover:text-purple-500 transform transition-all duration-300 ease-in-out"
          >
            {item}
            <span className="absolute left-0 -bottom-7 w-0 h-1 bg-purple-500 group-hover:w-full transition-all duration-300 ease-in-out"></span>
          </Link>
        ))}
      </nav>

      {/* Search Bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="px-4 py-2 rounded-full w-64 text-gray-700 focus:outline-none pr-12"
        />
        <button onClick={handleSearch} className="absolute right-10 text-gray-700 hover:text-purple-500">
          <FaSearch />
        </button>
        <button className="absolute right-2 text-gray-700 hover:text-purple-500">
          <FaMicrophone />
        </button>
      </div>

      {/* Profile */}
      <div>
        <Profile />
      </div>
    </header>
  );
};

export default Header;
