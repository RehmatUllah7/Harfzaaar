import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImageSearch } from "../../context/ImageSearchContext";
import { FaBookOpen, FaSearch, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
const ImageSearchResults = () => {
  const { imageData, clearImageData } = useImageSearch();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(12); // Start with 12 results
  const increment = 6; // Load 6 more each time
  const [isPoet, setIsPoet] = useState(false);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve token using the correct key
        if (!token) {
          console.error("Token not found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Ensure cookies are sent for authentication
        });

        const userRole = response.data.role;
        setIsPoet(userRole === "poet");
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (!imageData && isPoet !== null) {
      navigate(isPoet ? "/poetdashboard" : "/home");
    }
  }, [imageData, isPoet, navigate]);
  

  const formatPoetName = (name) => {
    return name.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleBack = () => {
    clearImageData();
    navigate(-1);
  };

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + increment);
  };

  // Display only visible results
  const displayedPoetry = imageData?.poetry?.slice(0, visibleCount) || [];
  const hasMore = imageData?.poetry?.length > visibleCount;

  if (!imageData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 via-black to-purple-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-xl"
        >
          <FaSearch className="mx-auto text-4xl text-purple-400 mb-4" />
          <p className="text-xl text-white font-light mb-6">No search results found</p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-full transition-all shadow-lg flex items-center mx-auto"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-sm border-b border-purple-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            {imageData.genre && (
              <h1 className="text-3xl font-bold text-purple-400">
                {imageData.genre} Poetry
              </h1>
            )}
            {imageData.poet && (
              <h1 className="text-3xl font-bold text-purple-400">
                {formatPoetName(imageData.poet)}
              </h1>
            )}
            <p className="text-purple-300 mt-1">
              Showing {displayedPoetry.length} of {imageData.poetry.length} results
            </p>
          </div>
          <button
            onClick={handleBack}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-full transition-all shadow"
          >
            New Search
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Poetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPoetry.map((poem, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all border border-gray-700 hover:border-purple-500/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-600/30 rounded-lg mr-3">
                  <FaBookOpen className="text-purple-300" />
                </div>
                <h3 className="text-xl font-urdu text-right w-full text-white font-medium">
                  {poem.title}
                </h3>
              </div>
              <div className="text-right font-urdu text-gray-200  whitespace-pre-line leading-loose tracking-wide">
                {poem.content}
              </div>
              {imageData.genre && (
                <div className="mt-4 text-sm text-purple-300">
                  Genre: {imageData.genre}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSeeMore}
              className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-full transition-all shadow-lg"
            >
              <span>See More</span>
              <FaChevronDown className="ml-2" />
            </button>
          </div>
        )}

        {displayedPoetry.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block p-8 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-xl">
              <p className="text-xl text-white mb-6 font-light">No poetry found matching your image</p>
              <button
                onClick={handleBack}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-full transition-all shadow-lg"
              >
                Try Another Image
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ImageSearchResults;