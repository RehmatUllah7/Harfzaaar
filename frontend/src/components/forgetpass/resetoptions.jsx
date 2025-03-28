import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../../assets/logo.jpg"; // Logo as background

const ResetPassword = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-gray-900 to-black min-h-screen flex flex-col items-center justify-center">
      {/* Background Image */}
      <img
        src={logo}
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full opacity-30"
      />

      {/* Heading */}
      <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
        HarfZaar
      </h1>

      {/* Reset Options Container */}
      <div className="relative w-full max-w-md bg-gray-800 bg-opacity-95 p-8 rounded-2xl shadow-2xl text-center">
        <h2 className="text-white text-lg font-semibold mb-6">
          Choose a Reset Method
        </h2>

        <button 
        onClick={() => navigate("/viapassword")}
        className="w-full bg-gradient-to-r from-red-500 to-purple-600 text-white py-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 mb-4">
          Continue via Password
        </button>

        <button
          onClick={() => navigate("/reset")} // Navigate to /reset
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
        >
          Continue via Email
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
