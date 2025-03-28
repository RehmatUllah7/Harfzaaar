import React, { useState } from 'react';
import logo from "../../assets/logo.jpg";
import { useNavigate } from 'react-router-dom';

const ContinueViaPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [previousPassword, setPreviousPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reEnterNewPassword, setReEnterNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password validation function
  const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    // Frontend Validations
    if (!email || !previousPassword || !newPassword || !reEnterNewPassword) {
      setError("All fields are required.");
      return;
    }

    if (!isValidPassword(newPassword)) {
      setError("Password must be at least 8 characters long, contain one uppercase letter, and one number.");
      return;
    }

    if (newPassword !== reEnterNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/change-passwordviapassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          oldPassword: previousPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(data.message || 'Failed to change password.');
      }
    } catch (error) {
      setError('An error occurred while changing the password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-gray-900 to-black min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">HarfZaar</h1>
      <img
        src={logo}
        alt="Background image"
        className="absolute inset-0 object-cover w-full h-full opacity-30"
      />
      <div className="relative w-full max-w-md bg-gray-800 bg-opacity-95 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-white text-center mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="w-full px-4 py-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={previousPassword}
              onChange={(e) => setPreviousPassword(e.target.value)}
              placeholder="Previous Password"
              className="w-full px-4 py-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-4 py-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={reEnterNewPassword}
              onChange={(e) => setReEnterNewPassword(e.target.value)}
              placeholder="Re-enter New Password"
              className="w-full px-4 py-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          <button
            type="submit"
            className={`w-full px-4 py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-purple-600 rounded-lg shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'CHANGE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContinueViaPassword;