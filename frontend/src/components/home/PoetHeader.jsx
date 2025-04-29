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
      POET HEADER
      </div>
    </header>
  );
};

export default Header;
