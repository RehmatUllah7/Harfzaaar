import React, { useState } from "react";
import Header from "@/components/home/Header"; // Import Header
import { toast } from "react-toastify"; // For notifications
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BecomePoet = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    poetName: "",
    poetryDomain: "Ghazal", // Default value
    poetryTitle: "",
    poetryContent: "",
    genre: "Romantic", // Default value
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ poetryTitle: "", poetryContent: "" });

  // Urdu Validation Function
  const isUrduText = (text) => /^[\u0600-\u06FF\s]+$/.test(text);

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "poetryTitle" || name === "poetryContent") {
      if (value && !isUrduText(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only Urdu text is allowed.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }

    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Simulate success message
      toast.success("Poetry submitted successfully!");
  
      // Update user role to "poet" in local storage
      const user = JSON.parse(localStorage.getItem("user")) || {};
      user.role = "poet";
      localStorage.setItem("user", JSON.stringify(user));
  
      // Navigate to home page
      navigate("/poethome");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white">
      <Header /> {/* Import Header */}

      <div className="max-w-2xl mx-auto p-8 mt-10 bg-white text-black rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Become a Poet</h2>
        <p className="text-center text-gray-600 mb-8">
          Share your poetry with the world. Fill out the form below to submit your work.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Poet Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Poet Name</label>
            <input
              type="text"
              name="poetName"
              value={formData.poetName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full p-3 mt-1 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Poetry Domain */}
          <div>
            <label className="block text-gray-700 font-semibold">Poetry Domain</label>
            <select
              name="poetryDomain"
              value={formData.poetryDomain}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Ghazal">Ghazal</option>
              <option value="Nazm">Nazm</option>
              <option value="Rubai">Rubai</option>
              <option value="Marsiya">Marsiya</option>
            </select>
          </div>

          {/* Poetry Title (Only Urdu) */}
          <div>
            <label className="block text-gray-700 font-semibold">Poetry Title</label>
            <input
              type="text"
              name="poetryTitle"
              value={formData.poetryTitle}
              onChange={handleChange}
              placeholder="شاعری کا عنوان لکھیں"
              required
              className="w-full p-3 mt-1 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 urdu-font"
            />
            {errors.poetryTitle && <p className="text-red-500 text-sm mt-1">{errors.poetryTitle}</p>}
          </div>

          {/* Poetry Content (Only Urdu) */}
          <div>
            <label className="block text-gray-700 font-semibold">Your Poetry</label>
            <textarea
              name="poetryContent"
              value={formData.poetryContent}
              onChange={handleChange}
              placeholder="اپنی شاعری یہاں لکھیں..."
              required
              rows="5"
              className="w-full p-3 mt-1 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 urdu-font"
            ></textarea>
            {errors.poetryContent && <p className="text-red-500 text-sm mt-1">{errors.poetryContent}</p>}
          </div>

          {/* Genre */}
          <div>
            <label className="block text-gray-700 font-semibold">Genre</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Romantic">Romantic</option>
              <option value="Mystical">Mystical</option>
              <option value="Philosophical">Philosophical</option>
              <option value="Revolutionary">Revolutionary</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
    type="submit"
    disabled={loading}
    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400"
  >
    {loading ? "Submitting..." : "Submit Poetry"}
  </button>
        </form>
      </div>

      {/* Urdu Font Style */}
      <style>
  {`
    .urdu-font {
      font-family: "Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", serif;
      font-size: 20px;
      direction: rtl;
      text-align: right;
    }
  `}
</style>
</ div>
  );
};

export default BecomePoet;
