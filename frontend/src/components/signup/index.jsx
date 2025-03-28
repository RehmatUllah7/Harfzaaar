import React, { useState } from 'react';
import logo from "../../assets/logo.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const HarfZaarRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError('');
  };

  const validatePassword = (password) => {
    const lengthCheck = password.length >= 6;
    const capitalCheck = /[A-Z]/.test(password);
    const numberCheck = /[0-9]/.test(password);

    if (!lengthCheck) {
      return "Password must be at least 6 characters long.";
    }
    if (!capitalCheck) {
      return "Password must contain at least one capital letter.";
    }
    if (!numberCheck) {
      return "Password must contain at least one number.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setEmailError('');
    setSuccessMessage('');
  
    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }
  
    if (!email.trim()) {
      setEmailError('Please enter your email.');
      return;
    }
  
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
  
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to Login...');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-gray-900 to-black min-h-screen">
      <img
        src={logo}
        alt="Background image"
        className="absolute inset-0 object-cover w-full h-full opacity-30"
      />

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">HarfZaar</h1>
        <p className="font-urdu text-3xl text-gray-200 mb-10 text-center leading-loose tracking-wide">
          آتی ہے اردو زباں آتے آتے
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-800 bg-opacity-95 p-8 rounded-2xl shadow-2xl"
        >
          <div className="mb-6">
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter Username"
              className="w-full px-4 py-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter Email"
              className="w-full px-4 py-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {emailError && (
            <p className="text-red-500 text-sm mb-6">{emailError}</p>
          )}

          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter Password"
              className="w-full px-4 py-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {/* Password visibility toggle */}
            <span
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              className="absolute right-4 top-3 cursor-pointer text-gray-400"
            >
              {showPassword ? (
                <FaEyeSlash className="w-6 h-6" />
              ) : (
                <FaEye className="w-6 h-6" />
              )}
            </span>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-6">{error}</p>
          )}

          {successMessage && (
            <p className="text-green-500 text-sm mb-6">{successMessage}</p>
          )}

          <button
            type="submit"
            className={`w-full px-4 py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-purple-600 rounded-lg shadow-md hover:from-red-600 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'REGISTER'}
          </button>


         
        </form>

        <p className="mt-6 text-gray-300 text-center">
          Already have a HarfZaar account?{' '}
          <Link
            to="/"
            className="text-blue-400 hover:text-blue-600 underline transition duration-300"
          >
            LOGIN HERE
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HarfZaarRegister;
