import React, { useState, useEffect } from "react";
import Header from "@/components/home/Header";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BecomePoet = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to become a poet');
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/user-info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Check if user is already a poet
        if (response.data.role === 'poet') {
          toast.error('You are already registered as a poet');
          navigate('/home');
          return;
        }
        
        // Set both userId and userRole
        setUserId(response.data.userId);
        setUserRole(response.data.role);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          toast.error('Session expired. Please login again');
          navigate('/');
        } else {
          toast.error('Error fetching user info');
        }
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const [formData, setFormData] = useState({
    poetName: "",
    poetryDomain: "Ghazal",
    poetryTitle: "",
    poetryContent: "",
    genre: "Romantic",
  });

  const [errors, setErrors] = useState({
    poetName: "",
    poetryTitle: "",
    poetryContent: "",
  });

  const isUrduText = (text) => /^[\u0600-\u06FF\s]+$/.test(text);
  const isEnglishText = (text) => /^[a-zA-Z\s]+$/.test(text);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "poetName") {
      if (value && !isEnglishText(value)) {
        setErrors((prev) => ({
          ...prev,
          poetName: "Only English letters are allowed.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, poetName: "" }));
      }
    }

    if (name === "poetryTitle" || name === "poetryContent") {
      if (value && !isUrduText(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only Urdu text is allowed.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const allFieldsFilled = Object.values(formData).every((val) => val.trim() !== "");
  const noErrors = Object.values(errors).every((err) => err === "");
  const isFormValid = allFieldsFilled && noErrors;

  const handleNext = () => {
    if (!isFormValid) {
      toast.error("Please fill out all fields correctly before proceeding.");
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Please login to become a poet");
      navigate('/');
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please try logging in again.");
      navigate('/');
      return;
    }

    const dataToStore = {
      poetName: formData.poetName,
      poetryDomain: formData.poetryDomain,
      poetryTitle: formData.poetryTitle,
      poetryContent: formData.poetryContent,
      genre: formData.genre,
      userId: userId
    };

    console.log('Storing data for next form:', dataToStore);
    localStorage.setItem("becomePoetData", JSON.stringify(dataToStore));
    navigate("/becomepoet2", { state: dataToStore });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white">
      <Header />
      <div className="max-w-2xl mx-auto p-8 mt-10 bg-white text-black rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Become a Poet</h2>
        <p className="text-center text-gray-600 mb-8">
          Share your poetry with the world. Fill out the form below to submit your work.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Poet Name (English Only)</label>
            <input
              type="text"
              name="poetName"
              value={formData.poetName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full p-3 mt-1 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.poetName && <p className="text-red-500 text-sm mt-1">{errors.poetName}</p>}
          </div>

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

          <div>
            <label className="block text-gray-700 font-semibold">Poetry Title (Urdu Only)</label>
            <input
              type="text"
              name="poetryTitle"
              value={formData.poetryTitle}
              onChange={handleChange}
              placeholder="شاعری کا عنوان لکھیں"
              required
              className="w-full p-3 mt-1 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 urdu-font"
            />
            {errors.poetryTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.poetryTitle}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Your Poetry (Urdu Only)</label>
            <textarea
              name="poetryContent"
              value={formData.poetryContent}
              onChange={handleChange}
              placeholder="اپنی شاعری یہاں لکھیں..."
              required
              rows="5"
              className="w-full p-3 mt-1 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 urdu-font"
            ></textarea>
            {errors.poetryContent && (
              <p className="text-red-500 text-sm mt-1">{errors.poetryContent}</p>
            )}
          </div>

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

          <button
            type="button"
            onClick={handleNext}
            disabled={!isFormValid}
            className={`w-full font-bold py-3 px-6 rounded-lg transition-transform transform ${
              isFormValid
                ? "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </form>
      </div>

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
    </div>
  );
};

export default BecomePoet;
