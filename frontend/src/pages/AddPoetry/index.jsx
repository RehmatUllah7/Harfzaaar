import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPoetry = () => {
  const [formData, setFormData] = useState({
    poetryDomain: "",
    poetryTitle: "",
    poetryContent: "",
    genre: "",
  });
  const [poetName, setPoetName] = useState("");  // For storing poetName
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);  // To handle loading state

  // Fetch the poet's name from the backend user-info route
  useEffect(() => {
    const fetchPoetName = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Assuming you store the token in localStorage
        const res = await axios.get("http://localhost:5000/api/auth/user-info", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Ensure cookies are sent for authentication
          });
  
        setPoetName(res.data.username); // Assuming the response contains 'username'
        setLoading(false); // Finished loading user info
      } catch (error) {
        setMessage("Error fetching user info.");
        console.error("Error fetching user info:", error);
        setLoading(false);
      }
    };

    fetchPoetName();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!poetName) {
        setMessage("Poet name is missing.");
        return;
      }

      const payload = { ...formData, poetName };  // Include poetName
      const res = await axios.post("http://localhost:5000/api/addpoetry", payload);
      setMessage("Poetry added successfully!");
      setFormData({
        poetryDomain: "",
        poetryTitle: "",
        poetryContent: "",
        genre: "",
      });
    } catch (error) {
      setMessage("Error adding poetry.");
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading user info...</p>;  // Show loading message
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add New Poetry</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="poetryDomain"
          value={formData.poetryDomain}
          onChange={handleChange}
          placeholder="Poetry Domain (e.g. Ghazal)"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="poetryTitle"
          value={formData.poetryTitle}
          onChange={handleChange}
          placeholder="Poetry Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="poetryContent"
          value={formData.poetryContent}
          onChange={handleChange}
          placeholder="Poetry Content"
          className="w-full border p-2 rounded h-40"
          required
        />
        <input
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Genre (e.g. Romantic)"
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPoetry;
