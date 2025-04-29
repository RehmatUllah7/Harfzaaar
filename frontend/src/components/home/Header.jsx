import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import h1 from "../../assets/logoHead.jpg";
import Profile from "./profile";
import { useImageSearch } from "../../context/ImageSearchContext";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
    <header className="bg-gray-900 p-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="relative bg-purple-900 flex items-center">
        <Link to="/home">
          <img src={h1} alt="HarfZaar Logo" className="h-12" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden sm:flex space-x-6 text-white">
        {["Poets", "News", "Qaafia", "Quiz", "Bazm"].map((item) => (
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
          className="px-4 py-2 rounded-full w-64 text-gray-700 focus:outline-none pr-16 hover:ring-2 hover:ring-purple-500 transition-all duration-200"
        />

        {/* Voice and Image Icons Container */}
        <div className="absolute right-2 flex items-center gap-2">
          {/* Microphone Button with Tooltip */}
          <div className="flex flex-col items-center group">
            <button
              onClick={handleVoiceSearch}
              className="text-gray-700 hover:text-purple-500 p-1"
            >
              <FaMicrophone className="w-5 h-5" />
            </button>
            <span className="absolute top-full mt-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Search by voice
            </span>
          </div>

          {/* Image Search Button with Tooltip */}
          <div className="flex flex-col items-center group">
            <button
              onClick={triggerFileInput}
              className="text-gray-700 hover:text-purple-500 p-1"
            >
              <FiImage className="w-5 h-5" />
            </button>
            <span className="absolute top-full mt-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Search by image
            </span>
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

      {/* Profile */}
      <div>
        <Profile />
      </div>
    </header>
  );
};

export default Header;