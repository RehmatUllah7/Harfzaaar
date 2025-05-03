import React, { useState } from "react";
import axios from "axios";

const AddNewsPage = () => {
  const [formData, setFormData] = useState({
    description: "",
    content: "",
    createdBy: "",
    image: null, // To hold the image file
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] }); // Set selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append("description", formData.description);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("createdBy", formData.createdBy);
    if (formData.image) formDataToSend.append("image", formData.image); // Append the image file

    try {
      const res = await axios.post("http://localhost:5000/api/news", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type for form data
        },
      });
      if (res.status === 201) {
        setMessage("News added successfully!");
        setFormData({ description: "", content: "", createdBy: "", image: null });
      }
    } catch (err) {
      setMessage("Failed to add news.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Add News</h1>
      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="description"
          placeholder="News Title/Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Full News Content"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32"
          required
        />
        <input
          type="text"
          name="createdBy"
          placeholder="Your Name"
          value={formData.createdBy}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Submit News
        </button>
      </form>
    </div>
  );
};

export default AddNewsPage;
