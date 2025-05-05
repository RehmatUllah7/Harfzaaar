import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiArrowLeft, FiPlus } from 'react-icons/fi';

const MyPoetryPage = () => {
  const navigate = useNavigate();
  const [poetry, setPoetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPoetry = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to view your poetry');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/poetry/my-poetry', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPoetry(response.data.poetry || []);
      } catch (error) {
        console.error("Error fetching poetry:", error);
        setError(error.response?.data?.message || 'Failed to load your poetry');
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
      if (!token) {
        setError('Authentication required');
        navigate('/login');
        return;
      }

      await axios.delete(`http://localhost:5000/api/poetry/${poetryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPoetry(poetry.filter(item => item._id !== poetryId));
    } catch (error) {
      setError('Failed to delete poetry');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Floating Ink Drops Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-purple-900 opacity-10"
            style={{
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 120 + 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              borderRadius: `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% / 60%`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Constellation Stars */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Back Button - Top Left */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 flex items-center text-white hover:text-purple-300 transition-colors group"
      >
        <FiArrowLeft className="mr-1 group-hover:-translate-x-1 transition-transform" size={20} />
        <span className="font-medium">Back</span>
      </button>

      {/* Add Poetry Button - Top Right (only shown when poetry exists) */}
      {poetry.length > 0 && (
        <button
          onClick={() => navigate('/addpoetry')}
          className="absolute top-6 right-6 z-20 flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/30"
        >
          <FiPlus className="mr-2" size={18} />
          Add Poetry
        </button>
      )}

      <div className="relative z-10 container mx-auto py-12 px-4">
        {/* Centered Title */}
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 text-center">
            My Poetry Collection
          </h1>
        </div>
        <p className="text-xl tracking-[0.1em] p-4 text-purple-200 max-w-2xl text-center mx-auto font-urdu relative z-10">
        آج ہم دار پہ کھینچے گئے جن باتوں پر </p>        <p className="text-xl p-0 text-purple-200 max-w-2xl text-center mx-auto font-urdu relative z-10">
        کیا عجب کل وہ زمانے کو نصابوں میں ملیں </p>        {error && (
          <div className="mb-8 p-4 bg-red-500/20 text-red-200 rounded-xl border border-red-400/30 backdrop-blur-sm max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {poetry.length === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 max-w-2xl mx-auto">
            <p className="text-purple-200 text-xl mb-6">You haven't created any poetry yet</p>
            <button
              onClick={() => navigate('/addpoetry')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/30"
            >
              Create Your First Poetry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-6 max-w-6xl mx-auto">
            {poetry.map((item) => (
              <div 
                key={item._id} 
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 transition-all hover:border-purple-400/30 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold tracking-[0.1em] font-urdu text-white">{item.poetryTitle}</h2>
                    <div className="flex space-x-3">
                    
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-line tracking-[0.1em] font-urdu text-purple-100 mb-6  leading-[2.2]">
                      {item.poetryContent}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full">
                      {item.genre}
                    </span>
                    <span className="px-3 py-1 bg-pink-900/30 text-pink-300 rounded-full">
                      {item.poetryDomain}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes twinkle {
          0% { opacity: 0.1; }
          50% { opacity: 0.4; }
          100% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

export default MyPoetryPage;