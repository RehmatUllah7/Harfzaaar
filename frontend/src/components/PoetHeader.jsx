import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMicrophone, FaSearch } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import h1 from "../assets/logoHead.jpg";
import Dropdown from "./Poetdropdown";
import { useImageSearch } from "../context/ImageSearchContext";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { setImageData } = useImageSearch();

  // Speech recognition hook
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    const loadingToastId = toast.loading("Analyzing the image...");
    try {
      const res = await fetch("http://localhost:5000/api/deepseek", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.success("Image analyzed successfully!", {
        id: loadingToastId,
      });
      if ((data?.genre || data?.poet) && data?.poetry?.length > 0) {
        setImageData(data);
        navigate("/is");
      } else {
        toast.error("No poetry found for the detected genre or poet.");
      }
    } catch (error) {
      toast.error("Failed to analyze image.");
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleVoiceSearch = () => {
    navigate('/voicesearch');
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-purple-900 p-4 flex items-center justify-between sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-90 border-b border-purple-700">
      {/* Logo with glow effect */}
      <div className="relative flex items-center group">
        <Link to="/poetdashboard" className="flex items-center">
          <img 
            src={h1} 
            alt="HarfZaar Logo" 
            className="h-12 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" 
          />
          <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300 hidden md:block">
            HarfZaar
          </span>
        </Link>
      </div>

      {/* Navigation Links with animated underline */}
      <nav className="hidden sm:flex space-x-8 text-white">
        {["Poets", "News", "Qaafia", "Bazm"].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase()}`}
            className="relative group px-2 py-1"
          >
            <span className="relative z-10">{item}</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        ))}
      </nav>

      {/* Search Bar with floating effect */}
      <div className={`relative flex items-center transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="px-5 py-2.5 rounded-full w-64 text-gray-800 focus:outline-none pr-16 shadow-lg focus:shadow-purple-500/30 transition-all duration-300 border border-transparent focus:border-purple-300"
          />
          
          {/* Search icon */}
          <button 
            onClick={handleSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <FaSearch className="w-4 h-4" />
          </button>

          {/* Voice and Image Icons Container */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {/* Microphone Button with pulse animation */}
            <div className="flex flex-col items-center group relative">
              <button
                onClick={handleVoiceSearch}
                className="text-gray-700 hover:text-purple-600 p-1.5 rounded-full bg-gray-100 hover:bg-purple-100 transition-all duration-300 group-hover:animate-pulse"
              >
                <FaMicrophone className="w-4 h-4" />
              </button>
              <span className="absolute top-full mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                Search by voice
              </span>
            </div>

            {/* Image Search Button with hover effect */}
            <div className="flex flex-col items-center group relative">
              <button
                onClick={triggerFileInput}
                className="text-gray-700 hover:text-purple-600 p-1.5 rounded-full bg-gray-100 hover:bg-purple-100 transition-all duration-300 group-hover:rotate-6"
              >
                <FiImage className="w-4 h-4" />
              </button>
              <span className="absolute top-full mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                Search by image
              </span>
            </div>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Profile with subtle animation */}
      <div className="transform transition-transform hover:scale-105 duration-200">
        <Dropdown />
      </div>
    </header>
  );
};

export default Header;