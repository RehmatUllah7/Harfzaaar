import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MyPoetryPage = () => {
  const navigate = useNavigate();
  const [poetry, setPoetry] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPoetry = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to view your poetry');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/poetry/my-poetry', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPoetry(response.data.poetry);
      } catch (error) {
        console.error("Error fetching poetry:", error);
        toast.error(error.response?.data?.message || 'Failed to load your poetry');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPoetry();
  }, [navigate]);

  const handleDelete = async (poetryId) => {
    if (!window.confirm('Are you sure you want to delete this poetry?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/poetry/${poetryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPoetry(poetry.filter(item => item._id !== poetryId));
      toast.success('Poetry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete poetry');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 hover:text-purple-800 mr-4"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold">My Poetry Collection</h1>
      </div>

      {poetry.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't created any poetry yet</p>
          <button
            onClick={() => navigate('/addpoetry')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Create Your First Poetry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {poetry.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{item.poetryTitle}</h2>
                <div className="flex space-x-2">
                 
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              
              <p className="whitespace-pre-line text-gray-700 mb-4">{item.poetryContent}</p>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Genre: {item.genre}</span>
                <span>Type: {item.poetryDomain}</span>
            
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPoetryPage;