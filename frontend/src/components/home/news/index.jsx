import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaUser, FaRegSadTear, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../Header";
import Footer from "../footer";
import PoetHeader from "@/components/PoetHeader";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/news/all");
        if (Array.isArray(res.data)) {
          setNewsList(res.data);
        } else {
          setErrorMessage("Invalid data format received from server.");
        }
      } catch (err) {
        setErrorMessage("Error fetching news. Please try again later.");
        console.error("Error fetching news:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-purple-900 text-white">
          {isPoet ? <PoetHeader /> : <Header />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold sm:text-5xl lg:text-6xl text-purple-300"
          >
            HarfZaar News
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Stay updated with our latest stories and announcements
          </motion.p>
        </div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-800 border-l-4 border-red-400 p-4 mb-8 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 text-red-200" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-100">{errorMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          </div>
        ) : newsList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900 rounded-xl shadow-md overflow-hidden p-8 text-center border border-gray-700"
          >
            <FaRegSadTear className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-white">No news available</h3>
            <p className="mt-2 text-gray-400">Check back later for updates</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Refresh
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {newsList.map((news) => (
              <motion.div
                key={news._id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="bg-gray-900 overflow-hidden shadow-lg rounded-lg hover:shadow-2xl transition-all duration-300 border border-purple-800"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-purple-100 leading-tight">
                      {news.description}
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-200 text-purple-900">
                      {news.category || "General"}
                    </span>
                  </div>

                  {news.image && (
                    <div className="mt-6 rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost:5000/uploads/${news.image}`}
                        alt={news.description}
                        className="w-full h-auto max-h-96 object-cover transition-transform duration-500 hover:scale-105 rounded-md"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <p className="mt-4 text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                    {news.content}
                  </p>

                  <div className="mt-6 pt-4 border-t border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center text-gray-400">
                      <FaUser className="h-4 w-4" />
                      <span className="ml-2 text-sm font-medium">
                        {typeof news.createdBy === "object"
                          ? news.createdBy.username
                          : news.createdBy || "Anonymous"}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <FaCalendarAlt className="h-4 w-4" />
                      <span className="ml-2 text-sm">
                        {new Date(news.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default News;
