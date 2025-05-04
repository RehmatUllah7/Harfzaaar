import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddNewsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    content: "",
    createdBy: "", // Will be populated with username
    image: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to add news');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/user-info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Set the createdBy field with the username
        setFormData(prev => ({
          ...prev,
          createdBy: response.data.username
        }));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          toast.error('Session expired. Please login again');
          navigate('/login');
        } else {
          toast.error('Error fetching user info');
        }
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent changing createdBy field
    if (name !== "createdBy") {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Please login to add news");
      navigate('/login');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("description", formData.description);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("createdBy", formData.createdBy);
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const res = await axios.post("http://localhost:5000/api/news", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      if (res.status === 201) {
        toast.success("News added successfully!");
        setFormData({ 
          description: "", 
          content: "", 
          createdBy: formData.createdBy, // Keep the username
          image: null 
        });
      }
    } catch (err) {
      toast.error("Failed to add news.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-2">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Add News</h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Title/Description</label>
          <input
            type="text"
            name="description"
            placeholder="Enter news title"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Content</label>
          <textarea
            name="content"
            placeholder="Enter news content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Created By</label>
          <input
            type="text"
            name="createdBy"
            value={formData.createdBy}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 focus:outline-none cursor-not-allowed"
          />
          <p className="text-sm text-gray-500 mt-1">Your username is automatically used as the author</p>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Image (Optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition-colors w-full"
        >
          Submit News
        </button>
      </form>
    </div>
  );
};

export default AddNewsPage;