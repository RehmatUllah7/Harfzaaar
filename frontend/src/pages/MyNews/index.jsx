import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiEdit, FiArrowLeft, FiPlus } from "react-icons/fi";

const MyNewsPage = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error("Error fetching news:", err);
        setError(err.response?.data?.message || "Failed to load news");
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
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Failed to delete news");
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

      {/* Add News Button - Top Right */}
      {newsList.length > 0 && (
        <button
          onClick={() => navigate('/addnews')}
          className="absolute top-6 right-6 z-20 flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/30"
        >
          <FiPlus className="mr-2" size={18} />
          Add News
        </button>
      )}

      <div className="relative z-10 container mx-auto py-12 px-4">
        {/* Centered Title */}
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 text-center">
            My News Articles
          </h1>
        </div>
        <p className="text-xl tracking-[0.1em] p-4 text-purple-200 max-w-2xl text-center mx-auto font-urdu relative z-10">
        ہم نے مانا کہ تغافل نہ کرو گے لیکن        </p> 
        <p className="text-xl p-2 text-purple-200 max-w-2xl text-center mx-auto font-urdu relative z-10">
        خاک ہو جائیں گے ہم تم کو خبر ہوتے تک        </p> 
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 text-red-200 rounded-xl border border-red-400/30 backdrop-blur-sm max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {newsList.length === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 max-w-2xl mx-auto">
            <p className="text-purple-200 text-xl mb-6">You haven't created any news yet</p>
            <button
              onClick={() => navigate('/addnews')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/30"
            >
              Create Your First News
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-4xl p-2 mx-auto">
            {newsList.map((news) => (
              <div 
                key={news._id} 
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 transition-all hover:border-purple-400/30 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white">{news.description}</h2>
                    <div className="flex space-x-3">
                    
                      <button
                        onClick={() => handleDelete(news._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {news.image && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost:5000/uploads/${news.image}`}
                        alt={news.description}
                        className="w-full h-auto max-h-96 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-line text-purple-100 mb-6 leading-relaxed">
                      {news.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm border-t border-white/10 pt-4">
                    <span className="px-3 py-1 bg-gray-800/30 text-gray-300 rounded-full">
                      By: {news.createdBy?.username || 'Unknown'}
                    </span>
                    <span className="px-3 py-1 bg-gray-800/30 text-gray-300 rounded-full">
                      Published: {new Date(news.createdAt).toLocaleDateString()}
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

export default MyNewsPage;