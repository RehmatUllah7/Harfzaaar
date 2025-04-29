import React, { useState } from 'react';
import logo from "../../../assets/logo.jpg"; // Ensure this path is correct
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from React Icons

const HarfZaarLogin = () => {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [loading, setLoading] = useState(false); // Initialize loading state
  const navigate = useNavigate(); // For navigation after successful login

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
  
    if (!username) {
      setErrorMessage('Please enter your username.');
      return;
    }
  
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
  
    setLoading(true); // Set loading to true when the request starts
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        navigate('/home'); // Redirect to the dashboard or desired page
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred while logging in. Please try again.');
    } finally {
      setLoading(false); // Set loading to false when the request completes
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
          {errorMessage && (
            <div className="mb-4 text-red-500 text-center">
              {errorMessage}
            </div>
          )}

          <div className="mb-6">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter Username"
              autoComplete="username" // Add autocomplete attribute
              className="w-full px-4 py-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter Password"
              autoComplete="current-password"
              className="w-full px-4 py-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {/* Password visibility toggle */}
            <span
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              className="absolute right-4 top-3 cursor-pointer text-gray-400"
            >
              {showPassword ? (
                <FaEyeSlash className="w-6 h-6" /> // Eye icon for password visibility
              ) : (
                <FaEye className="w-6 h-6" /> // Eye icon for password visibility
              )}
            </span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="rememberMe" className="ml-2 text-gray-300">
                Remember Me
              </label>
            </div>
            <a
              href="/resetoptions"
              className="text-blue-400 hover:text-blue-600 underline transition duration-300"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`w-full px-4 py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-purple-600 rounded-lg shadow-md hover:from-red-600 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>

        <p className="mt-6 text-gray-300 text-center">
          Don't have a HarfZaar account?{' '}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-600 underline transition duration-300"
          >
            CREATE ONE
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HarfZaarLogin;
