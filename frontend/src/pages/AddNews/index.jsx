import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddNewsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    content: "",
    image: null,
  });
  const [errors, setErrors] = useState({
    description: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {
      description: !formData.description ? "Description is required" : "",
      content: !formData.content ? "Content is required" : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrors({ ...errors, auth: "Please login to add news" });
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("description", formData.description);
    formDataToSend.append("content", formData.content);
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      await axios.post("http://localhost:5000/api/news", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      
      setSubmitted(true);
      setFormData({ description: "", content: "", image: null });
    } catch (err) {
      setErrors({ ...errors, submit: err.response?.data?.message || "Failed to add news" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
   <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
  {[...Array(25)].map((_, i) => (
    <div
      key={i}
      className="absolute bg-purple-900 opacity-20"
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
                <h3 className="text-3xl font-bold text-white mb-2">News Added!</h3>
                <p className="text-purple-200 mb-6">Your news has been successfully published.</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setErrors({
                      description: "",
                      content: "",
                    });
                  }}
                  className="px-6 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-full border border-white border-opacity-20 transition-all duration-300"
                >
                  Add More News
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-3">Add News</h2>
                  <p className="text-purple-200 max-w-md mx-auto">
                    Share the latest updates with your readers
                  </p>
                </div>

                {errors.submit && (
                  <div className="mb-6 p-3 bg-red-500/20 text-red-200 rounded-lg border border-red-400/30">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Description */}
                  <div className="space-y-1">
                    <label className="block text-purple-100 font-medium">
                      Title/Description <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="description"
                      className={`w-full px-5 py-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border ${
                        errors.description ? "border-red-400" : "border-white border-opacity-20"
                      } focus:border-purple-300 focus:ring-purple-300 text-white placeholder-purple-200 placeholder-opacity-50 focus:outline-none focus:ring-2 transition-all`}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter news title"
                      required
                    />
                    {errors.description && (
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
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <label className="block text-purple-100 font-medium">
                      Content <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="content"
                      rows="6"
                      className={`w-full px-5 py-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border ${
                        errors.content ? "border-red-400" : "border-white border-opacity-20"
                      } focus:border-purple-300 focus:ring-purple-300 text-white placeholder-purple-200 placeholder-opacity-50 focus:outline-none focus:ring-2 transition-all resize-none`}
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Write your news content here..."
                      required
                    />
                    {errors.content && (
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
                        {errors.content}
                      </p>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-1">
                    <label className="block text-purple-100 font-medium">
                      Image (Optional)
                    </label>
                    <div className={`w-full px-5 py-3 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl border border-white border-opacity-20 focus-within:border-purple-300 focus-within:ring-purple-300 focus-within:ring-2 transition-all`}>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                        loading ? "opacity-80 cursor-not-allowed" : "hover:shadow-purple-500/50"
                      } flex items-center justify-center`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Publishing...
                        </>
                      ) : (
                        "Publish News"
                      )}
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

export default AddNewsPage;