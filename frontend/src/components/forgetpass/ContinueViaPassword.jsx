import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';
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
      setError('All fields are required.');
      return;
    }

    if (!isValidPassword(newPassword)) {
      setError(
        'Password must be at least 8 characters long, contain one uppercase letter, and one number.'
      );
      return;
    }

    if (newPassword !== reEnterNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/change-passwordviapassword',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            currentPassword: previousPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate('/login'), 3000);
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
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-purple-900 via-gray-900 to-black px-4'>
      <h1 className='mb-6 text-6xl font-extrabold text-white drop-shadow-lg'>
        HarfZaar
      </h1>
      <img
        src={logo}
        alt='Background image'
        className='absolute inset-0 h-full w-full object-cover opacity-30'
      />
      <div className='relative w-full max-w-md rounded-2xl bg-gray-800 bg-opacity-95 p-8 shadow-2xl'>
        <h2 className='mb-4 text-center text-2xl font-semibold text-white'>
          Change Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter Email'
              className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
              required
            />
          </div>
          <div className='mb-4'>
            <input
              type='password'
              value={previousPassword}
              onChange={(e) => setPreviousPassword(e.target.value)}
              placeholder='Previous Password'
              className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
              required
            />
          </div>
          <div className='mb-4'>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='New Password'
              className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
              required
            />
          </div>
          <div className='mb-6'>
            <input
              type='password'
              value={reEnterNewPassword}
              onChange={(e) => setReEnterNewPassword(e.target.value)}
              placeholder='Re-enter New Password'
              className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
              required
            />
          </div>
          {error && <p className='mb-4 text-sm text-red-500'>{error}</p>}
          {message && <p className='mb-4 text-sm text-green-500'>{message}</p>}
          <button
            type='submit'
            className={`w-full rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 py-3 text-lg font-semibold text-white shadow-md ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'CHANGE PASSWORD'}
          </button>
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className='mt-4 w-full rounded-lg bg-gray-500 px-4 py-3 text-lg font-semibold text-white shadow-md hover:bg-gray-600'
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContinueViaPassword;
