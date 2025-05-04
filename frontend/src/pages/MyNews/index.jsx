import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiEdit, FiArrowLeft, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

const MyNewsPage = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [poetName, setPoetName] = useState("");

  useEffect(() => {
    const fetchMyNews = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('authToken');
          
          if (!token) {
            throw new Error('No authentication token found');
          }
      
          const response = await axios.get('http://localhost:5000/api/news/my-news', {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.status === 200) {
            setNewsList(response.data);
          } else {
            throw new Error(`Unexpected status code: ${response.status}`);
          }
        } catch (err) {
          console.error("Full error details:", err);
          
          // More detailed error messages
          if (err.response) {
            // The request was made and the server responded with a status code
            console.error("Response data:", err.response.data);
            console.error("Response status:", err.response.status);
            console.error("Response headers:", err.response.headers);
            
            if (err.response.status === 401) {
              setError("Session expired. Please login again.");
              localStorage.removeItem('authToken');
              navigate('/login');
            } else if (err.response.data?.message) {
              setError(err.response.data.message);
            } else {
              setError("Server error occurred. Please try again later.");
            }
          } else if (err.request) {
            // The request was made but no response was received
            console.error("No response received:", err.request);
            setError("No response from server. Check your connection.");
          } else {
            // Something happened in setting up the request
            console.error("Request setup error:", err.message);
            setError(err.message || "Failed to setup request");
          }
        } finally {
          setLoading(false);
        }
      };

    fetchMyNews();
  }, [navigate]);

  const handleDelete = async (newsId) => {
    const confirmed = window.confirm('Are you sure you want to delete this news item?');
    if (!confirmed) return;
  
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`http://localhost:5000/api/news/${newsId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        setNewsList(newsList.filter(news => news._id !== newsId));
        toast.success(response.data.message || 'News deleted successfully');
      }
    } catch (err) {
      console.error("Delete error details:", {
        error: err,
        response: err.response?.data
      });
      
      const errorMessage = err.response?.data?.message || 
                         (err.response?.status === 404 
                           ? "News not found or already deleted" 
                           : "Failed to delete news");
      
      toast.error(errorMessage);
      
      // Refresh news list if there might be a sync issue
      if (err.response?.status === 404) {
        fetchMyNews(); // Re-fetch the current list
      }
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-600 hover:text-purple-800 mr-4"
          >
            <FiArrowLeft className="mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            My News Articles
          </h1>
          <button
            onClick={() => navigate('/addnews')}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            <FiPlus className="mr-1" />
            Add News
          </button>
        </div>

        {newsList.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No news articles yet</h3>
            <p className="mt-1 text-gray-500">Get started by creating your first news article.</p>
            <button
              onClick={() => navigate('/addnews')}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Create News
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {newsList.map((news) => (
              <div
                key={news._id}
                className="bg-white shadow overflow-hidden rounded-lg hover:shadow-md transition-shadow duration-300"
              >
                <div className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {news.description}
                    </h2>
                    <div className="flex space-x-2">
                      
                      <button
                        onClick={() => handleDelete(news._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {news.image && (
                    <div className="mt-4 mb-4">
                      <img
                        src={`http://localhost:5000/uploads/${news.image}`}
                        alt={news.description}
                        className="w-full h-auto max-h-96 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <p className="text-gray-700 whitespace-pre-line mt-2">
                    {news.content}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
          By: {news.createdBy?.username || 'Unknown'} | {/* Handle nested username */}
          Published: {new Date(news.createdAt).toLocaleDateString()}
        </p>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(news.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNewsPage;