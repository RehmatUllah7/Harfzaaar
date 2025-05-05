import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPoetry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    poetryDomain: "",
    poetryTitle: "",
    poetryContent: "",
    genre: "",
  });
  const [errors, setErrors] = useState({
    poetryDomain: "",
    poetryTitle: "", 
    poetryContent: "",
    genre: "",
  });
  const [poetName, setPoetName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Poetry domain options
  const poetryDomains = ["Ghazal", "Nazm", "Marsiya", "Rubai"];
  
  // Genre options
  const genres = [
    "Romantic", "Social", "Inspirational", 
    "Melancholic", "Nature", "Philosophical", "Mystical"
  ];

  // Validate form fields
  const validate = () => {
    const newErrors = {
      poetryDomain: !formData.poetryDomain ? "Poetry type is required" : "",
      poetryTitle: !formData.poetryTitle ? "Title is required" : "",
      poetryContent: !formData.poetryContent ? "Content is required" : "",
      genre: !formData.genre ? "Genre is required" : ""
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  // Fetch poet's name
  useEffect(() => {
    const fetchPoetName = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://localhost:5000/api/auth/user-info", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setPoetName(res.data.username);
        setLoading(false);
      } catch (error) {
        setMessage("Error fetching user info.");
        console.error("Error fetching user info:", error);
        setLoading(false);
      }
    };
    fetchPoetName();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      if (!poetName) {
        setMessage("Poet name is missing.");
        return;
      }

      const payload = { ...formData, poetName };
      await axios.post("http://localhost:5000/api/addpoetry", payload);
      setSubmitted(true);
      setMessage("Poetry added successfully!");
    } catch (error) {
      setMessage("Error adding poetry.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading user info...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
  {[...Array(20)].map((_, i) => (
    <div
      key={i}
      className="absolute bg-white/5 border border-white/10"
      style={{
        width: `${Math.random() * 60 + 20}px`,
        height: `${Math.random() * 80 + 30}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        transform: `rotate(${Math.random() * 360}deg)`,
        animation: `float ${Math.random() * 30 + 15}s linear infinite`,
        clipPath: `polygon(${Math.random() * 30 + 35}% ${Math.random() * 30}%, ${Math.random() * 30 + 70}% ${Math.random() * 30 + 30}%, ${Math.random() * 30 + 30}% ${Math.random() * 30 + 70}%, ${Math.random() * 30}% ${Math.random() * 30 + 40}%)`
      }}
    />
  ))}
</div>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-10 flex items-center text-white hover:text-purple-300 transition-colors group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-1 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back</span>
      </button>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-20 transition-all duration-500 hover:shadow-purple-500/30">
          <div className="p-8 md:p-10">
            {submitted ? (
              <div className="text-center py-10">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500 bg-opacity-20 mb-6 animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Poetry Added!</h3>
                <p className="text-purple-200 mb-6">Your poetry has been successfully submitted.</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      poetryDomain: "",
                      poetryTitle: "",
                      poetryContent: "",
                      genre: "",
                    });
                    setErrors({
                      poetryDomain: "",
                      poetryTitle: "", 
                      poetryContent: "",
                      genre: "",
                    });
                  }}
                  className="px-6 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-full border border-white border-opacity-20 transition-all duration-300"
                >
                  Add More
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-3">Add New Poetry</h2>
                  <p className="text-purple-200 max-w-md mx-auto">
                    Share your poetry with the world
                  </p>
                </div>

                
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Poetry Domain Dropdown */}
                  <div className="space-y-1">
                    <label className="block text-purple-100 font-medium">
                      Poetry Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="poetryDomain"
                      value={formData.poetryDomain}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 bg-gray-900 rounded-xl border ${
                        errors.poetryDomain ? "border-red-400" : "border-white border-opacity-20"
                      } focus:border-purple-300 focus:ring-purple-300 bg-purple-500 text-white focus:outline-none focus:ring-2 transition-all`}
                      required
                    >
                      <option value="" disabled className="bg-purple-500">Select type...</option>
                      {poetryDomains.map((domain) => (
                        <option key={domain} value={domain} className="bg-purple-500">{domain}</option>
                      ))}
                    </select>
                    {errors.poetryDomain && (
                      <p className="text-red-300 text-sm mt-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.poetryDomain}
                      </p>
                    )}
                  </div>

                  {/* Poetry Title */}
                  <div className="space-y-1">
                    <label className="block text-purple-100 font-medium">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="poetryTitle"
                      className={`w-full px-5 py-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border ${
                        errors.poetryTitle ? "border-red-400" : "border-white border-opacity-20"
                      } focus:border-purple-300 focus:ring-purple-300 text-white placeholder-purple-200 placeholder-opacity-50 focus:outline-none focus:ring-2 transition-all`}
                      value={formData.poetryTitle}
                      onChange={handleChange}
                      placeholder="Enter poetry title"
                      required
                    />
                    {errors.poetryTitle && (
                      <p className="text-red-300 text-sm mt-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.poetryTitle}
                      </p>
                    )}
                  </div>

                  {/* Poetry Content */}
                  <div className="space-y-1">
                    <label className="block text-purple-100 font-medium">
                      Poetry Content <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="poetryContent"
                      rows="6"
                      className={`w-full px-5 py-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border ${
                        errors.poetryContent ? "border-red-400" : "border-white border-opacity-20"
                      } focus:border-purple-300 focus:ring-purple-300 text-white placeholder-purple-200 placeholder-opacity-50 focus:outline-none focus:ring-2 transition-all resize-none`}
                      value={formData.poetryContent}
                      onChange={handleChange}
                      placeholder="Write your poetry here..."
                      required
                    />
                    {errors.poetryContent && (
                      <p className="text-red-300 text-sm mt-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.poetryContent}
                      </p>
                    )}
                  </div>

                  {/* Genre Dropdown */}
                  <div className="space-y-1">
                    <label className="block text-purple-100 font-medium">
                      Genre <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 bg-gray-900 rounded-xl border ${
                        errors.genre ? "border-red-400" : "border-white border-opacity-20"
                      } focus:border-purple-300 focus:ring-purple-300 bg-purple-500 text-white focus:outline-none focus:ring-2 transition-all`}
                      required
                    >
                      <option value="" disabled className="text-gray-400">Select genre...</option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre} className="bg-purple-500">{genre}</option>
                      ))}
                    </select>
                    {errors.genre && (
                      <p className="text-red-300 text-sm mt-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.genre}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/50 flex items-center justify-center"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AddPoetry;