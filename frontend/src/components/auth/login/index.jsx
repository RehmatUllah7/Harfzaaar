import React, { useState } from 'react';
import logo from '../../../assets/logo.jpg'; // Ensure this path is correct
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
        localStorage.setItem('role', data.role); // Store the user's role

        // Navigate based on role
        if (data.role === 'poet') {
          navigate('/poetdashboard'); // Navigate to poet dashboard
        } else {
          navigate('/home'); // Navigate to regular home page
        }
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
  <div className='relative min-h-screen overflow-hidden bg-gradient-to-r from-purple-900 via-gray-900 to-black'>
    <img
      src={logo}
      alt='Background image'
      className='absolute inset-0 h-full w-full object-cover opacity-30'
    />

    <div className='relative flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:py-10'>
      <h1 className='mb-4 text-4xl font-extrabold text-white drop-shadow-lg md:text-6xl'>
        HarfZaad
      </h1>
      <p className='mb-8 text-center font-urdu text-2xl leading-relaxed tracking-wide text-gray-200 sm:text-3xl'>
       کہ آتی ہے اردو زباں آتے آتے
      </p>

      <form
        onSubmit={handleSubmit}
        className='w-full max-w-sm rounded-2xl bg-gray-800 bg-opacity-95 p-6 shadow-2xl sm:max-w-md sm:p-8'
      >
        {errorMessage && (
          <div className='mb-4 text-center text-red-500'>{errorMessage}</div>
        )}

        <div className='mb-5'>
          <input
            type='text'
            id='username'
            name='username'
            value={username}
            onChange={handleUsernameChange}
            placeholder='Enter Username'
            autoComplete='username'
            className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>

        <div className='relative mb-5'>
          <input
            type={showPassword ? 'text' : 'password'}
            id='password'
            name='password'
            value={password}
            onChange={handlePasswordChange}
            placeholder='Enter Password'
            autoComplete='current-password'
            className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-4 top-3 cursor-pointer text-gray-400'
          >
            {showPassword ? <FaEyeSlash className='h-6 w-6' /> : <FaEye className='h-6 w-6' />}
          </span>
        </div>

        <div className='mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='rememberMe'
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className='h-5 w-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500'
            />
            <label htmlFor='rememberMe' className='ml-2 text-gray-300 text-sm'>
              Remember Me
            </label>
          </div>
          <a
            href='/reset'
            className='text-sm text-blue-400 underline transition duration-300 hover:text-blue-600'
          >
            Forgot Password?
          </a>
        </div>

        <button
          type='submit'
          disabled={loading}
          className={`w-full rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 py-3 text-base font-semibold text-white shadow-md transition duration-300 hover:from-red-600 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
            loading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'LOGIN'}
        </button>
      </form>

      <p className='mt-6 text-center text-sm text-gray-300 sm:text-base'>
        Don't have a HarfZaad account?{' '}
        <Link
          to='/signup'
          className='text-blue-400 underline transition duration-300 hover:text-blue-600'
        >
          CREATE ONE
        </Link>
      </p>
    </div>
  </div>
);

};

export default HarfZaarLogin;
