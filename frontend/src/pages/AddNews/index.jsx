import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddNewsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Please login to add news");
      navigate('/login');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("description", formData.description);
    formDataToSend.append("content", formData.content);
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const res = await axios.post("http://localhost:5000/api/news", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      
      toast.success("News added successfully!");
      setFormData({ description: "", content: "", image: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add news");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Add News</h1>
      
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
          disabled={loading}
          className={`w-full py-2 px-4 rounded transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-700 text-white hover:bg-purple-800"
          }`}
        >
          {loading ? "Submitting..." : "Submit News"}
        </button>
      </form>
    </div>
  );
};

export default AddNewsPage;