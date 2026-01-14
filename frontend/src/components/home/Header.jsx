import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMicrophone, FaBars, FaTimes } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import h1 from "../../assets/or.png";
import Profile from "./profile";
import { useImageSearch } from "../../context/ImageSearchContext";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    navigate("/voicesearch");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Main Header */}
      <header className="bg-gray-900 p-4 flex items-center justify-between sticky top-0 z-50">
        {/* Logo */}
        <div className="relative bg-gray-900 flex items-center">
          <Link to="/home">
            <img src={h1} alt="HarfZaad Logo" className="h-12" />
          </Link>
        </div>

        {/* Hamburger Menu - Mobile only */}
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl sm:hidden"
          aria-label="Toggle Menu"
        >
          <FaBars />
        </button>

        {/* Navigation Links - Desktop only */}
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

        {/* Search Bar - Desktop only */}
        <div className="hidden sm:relative sm:flex sm:items-center">
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
            {/* Microphone Button */}
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

            {/* Image Search Button */}
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

        {/* Profile - Desktop only */}
        <div className="hidden sm:block">
          <Profile />
        </div>
      </header>

      {/* Mobile Search Bar (Below Header, visible only on mobile) */}
    <div className="sm:hidden bg-gray-900 px-4 py-2 sticky top-12 z-50">
  <div className="relative">
    <input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      className="w-full px-4 py-2 rounded-xl text-gray-700 focus:outline-none pr-12 hover:ring-2 hover:ring-purple-500 transition-all duration-200"
    />

    <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex gap-4">
      <button
        onClick={handleVoiceSearch}
        className="text-gray-700 hover:text-purple-500 p-1"
        aria-label="Voice Search"
      >
        <FaMicrophone className="w-5 h-5" />
      </button>
      <button
        onClick={triggerFileInput}
        className="text-gray-700 hover:text-purple-500 p-1"
        aria-label="Image Search"
      >
        <FiImage className="w-5 h-5" />
      </button>
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


      {/* Sidebar - Mobile only */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button
            onClick={toggleSidebar}
            aria-label="Close Menu"
            className="text-white text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Profile at top inside sidebar */}
        <div className="px-4 py-4 border-b border-gray-700">
          <Profile />
        </div>

        <nav className="flex flex-col p-4 space-y-4">
          {["Poets", "News", "Qaafia", "Quiz", "Bazm"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              onClick={() => setSidebarOpen(false)}
              className="hover:text-purple-500 text-lg"
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Header;
