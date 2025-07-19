import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaSearch,
  FaArrowLeft,
  FaStar,
} from "react-icons/fa";
import { RiQuillPenFill } from "react-icons/ri";
import axios from "axios";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const increment = 6;
  const [isPoet, setIsPoet] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token not found");
          return;
        }
        const response = await axios.get(
          "http://localhost:5000/api/auth/user-info",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setIsPoet(response.data.role === "poet");
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:5000/api/search?query=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setSearchResults(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const handleSeeMore = () => setVisibleCount((prev) => prev + increment);

  const handleNewSearch = () => {
    navigate(isPoet ? "/poetdashboard" : "/home");
  };

  const displayedResults = searchResults.slice(0, visibleCount);
  const hasMore = searchResults.length > visibleCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col items-center py-6 px-4 sm:px-6 md:px-10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-400/10"
            style={{
              fontSize: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <RiQuillPenFill />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-7xl z-10">
        {/* Header with Search Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-3 sm:gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <button
              onClick={handleNewSearch}
              className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg transition text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <FaArrowLeft className="text-xs sm:text-sm" />
              New Search
            </button>
            <div className="hidden sm:block h-8 w-px bg-purple-500/50"></div>
            <div className="text-sm sm:text-base text-purple-300 whitespace-nowrap text-center sm:text-left mt-1 sm:mt-0">
              <span className="text-purple-400">Search for:</span>{" "}
              <span className="font-urdu text-lg sm:text-xl ml-1 text-white break-words">
                "{query}"
              </span>
            </div>
          </motion.div>

          {searchResults.length > 0 && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-purple-900/30 border border-purple-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap mt-3 sm:mt-0 justify-center sm:justify-start"
            >
              <FaStar className="text-yellow-400 text-xs sm:text-sm" />
              <span>
                <span className="text-purple-300">{searchResults.length}</span>{" "}
                <span className="text-white"> Results Found </span>
              </span>
            </motion.div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center mt-16 gap-4">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }}
              className="relative w-16 h-16 sm:w-20 sm:h-20"
            >
              <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-purple-300 border-b-purple-700 border-l-purple-400 animate-spin"></div>
              <div className="absolute inset-1.5 rounded-full border-4 border-t-purple-300 border-r-purple-500 border-b-purple-400 border-l-purple-700 animate-spin animation-delay-100"></div>
              <RiQuillPenFill className="absolute inset-4 text-purple-400" />
            </motion.div>
            <p className="text-purple-300 mt-2 text-base sm:text-lg text-center px-6">
              Searching our poetry collection...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            className="bg-red-900/30 border border-red-500/30 p-5 rounded-xl max-w-md mx-auto text-center mt-14"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-medium mb-2 text-red-400">
              Search Error
            </h3>
            <p className="text-red-200 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-red-700/50 hover:bg-red-600/60 rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Results Grid */}
        {!isLoading && !error && displayedResults.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {displayedResults.map((poetry, idx) => (
                <motion.div
                  key={idx}
                  className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-purple-500/30 transition border border-gray-700 hover:border-purple-500/50 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-3 sm:mb-4 gap-3">
                    <div className="p-2 bg-purple-600/30 rounded-lg flex-shrink-0">
                      <FaBookOpen className="text-purple-300 text-lg sm:text-xl" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-urdu text-right text-white font-semibold flex-1 break-words">
                      {poetry.poetryTitle}
                    </h3>
                  </div>
                  <div className="text-right font-urdu text-gray-200 whitespace-pre-line leading-relaxed tracking-wide text-sm sm:text-base flex-grow overflow-hidden">
                    {poetry.poetryContent}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* See More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSeeMore}
                  className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-2 rounded-full shadow-md transition text-sm sm:text-base"
                >
                  See More
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results State */}
        {!isLoading && !error && searchResults.length === 0 && (
          <motion.div
            className="text-center py-16 px-4 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-purple-500/30 shadow-2xl backdrop-blur-sm relative overflow-hidden max-w-xs mx-auto">
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                  className="absolute text-purple-400/5"
                  style={{ fontSize: 80, left: "20%", top: "30%" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <RiQuillPenFill />
                </motion.div>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-900/50 rounded-full mb-6 mx-auto">
                  <FaSearch className="text-3xl text-purple-400" />
                </div>
                <h3 className="text-2xl text-white mb-3 font-medium">
                  No Results Found
                </h3>
                <p className="text-lg text-purple-200 mb-4 font-light">
                  We couldn't find any poetry matching your search.
                </p>
                <p className="font-urdu text-xl text-gray-300 mb-6">کوئی نتیجہ نہیں ملا</p>
                <button
                  onClick={handleNewSearch}
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-full transition-shadow shadow-md flex items-center gap-2 mx-auto text-sm sm:text-base"
                >
                  <FaArrowLeft className="text-sm" />
                  Try a New Search
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
