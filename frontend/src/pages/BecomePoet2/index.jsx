import React, { useState, useEffect } from "react";
import Header from "@/components/home/Header";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BecomePoet2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const poetryData = location.state; // Poetry data from the first form
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bio, setBio] = useState("");
  const [couplet, setCouplet] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
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
        
        if (response.data.role === 'poet') {
          toast.error('You are already registered as a poet');
          navigate('/home');
          return;
        }
        
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error checking user role:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          toast.error('Session expired. Please login again');
          navigate('/');
        } else {
          toast.error('Error checking user role');
        }
      }
    };

    if (!poetryData) {
      toast.error('Please complete the first form');
      navigate('/becomepoet');
      return;
    }

    checkUserRole();
  }, [navigate, poetryData]);

  const isFormValid = image && bio.trim() !== "" && couplet.trim() !== "";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bio || !couplet || !image || !poetryData) {
      toast.error("Please fill all fields");
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login to submit');
      navigate('/');
      return;
    }

    const finalPayload = {
      poetName: poetryData.poetName,
      poetryDomain: poetryData.poetryDomain,
      poetryTitle: poetryData.poetryTitle,
      poetryContent: poetryData.poetryContent,
      genre: poetryData.genre,
      biography: bio,
      couplet,
      image,
      userId: poetryData.userId
    };

    console.log('Token:', token);
    console.log('Submitting payload:', finalPayload);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/poets/submit", finalPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);

      if (response.data.message === "Poet registered and role updated!") {
        toast.success("Poet registered successfully!");
        localStorage.removeItem("becomePoetData");
        navigate("/");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error('Error submitting poet details:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid data submitted");
      } else {
        toast.error(error.response?.data?.message || "Submission failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-purple-900 min-h-screen text-white">
      <Header />
      <div className="max-w-2xl mx-auto p-8 mt-10 bg-white text-black rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Complete Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold">Upload Your Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 w-full border p-2 rounded bg-gray-100"
              required
            />
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Short Biography</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your biography here..."
              required
              rows="4"
              className="w-full p-3 mt-1 border rounded-lg bg-gray-100"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Famous Couplets</label>
            <textarea
              value={couplet}
              onChange={(e) => setCouplet(e.target.value)}
              placeholder="Share your famous couplet(s)"
              required
              rows="3"
              className="w-full p-3 mt-1 border rounded-lg bg-gray-100"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 px-6 rounded-lg transition-all transform ${
              isFormValid && !loading
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BecomePoet2;
