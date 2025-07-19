import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';
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
      return 'Password must be at least 6 characters long.';
    }
    if (!capitalCheck) {
      return 'Password must contain at least one capital letter.';
    }
    if (!numberCheck) {
      return 'Password must contain at least one number.';
    }
    return '';
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
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to Login...');
        setTimeout(() => navigate('/login'), 3000);
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
        <div className='mb-5'>
          <input
            type='text'
            id='username'
            value={username}
            onChange={handleUsernameChange}
            placeholder='Enter Username'
            className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-sm text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>

        <div className='mb-5'>
          <input
            type='email'
            id='email'
            value={email}
            onChange={handleEmailChange}
            placeholder='Enter Email'
            className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-sm text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>

        {emailError && (
          <p className='mb-5 text-sm text-red-500'>{emailError}</p>
        )}

        <div className='relative mb-5'>
          <input
            type={showPassword ? 'text' : 'password'}
            id='password'
            value={password}
            onChange={handlePasswordChange}
            placeholder='Enter Password'
            className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-sm text-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-4 top-3 cursor-pointer text-gray-400'
          >
            {showPassword ? (
              <FaEyeSlash className='h-5 w-5' />
            ) : (
              <FaEye className='h-5 w-5' />
            )}
          </span>
        </div>

        {error && <p className='mb-5 text-sm text-red-500'>{error}</p>}
        {successMessage && (
          <p className='mb-5 text-sm text-green-500'>{successMessage}</p>
        )}

        <button
          type='submit'
          className={`w-full rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 py-3 text-base font-semibold text-white shadow-md transition duration-300 hover:from-red-600 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
            loading ? 'opacity-50' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'REGISTER'}
        </button>
      </form>

      <p className='mt-6 text-center text-sm text-gray-300 sm:text-base'>
        Already have a HarfZaad account?{' '}
        <Link
          to='/login'
          className='text-blue-400 underline transition duration-300 hover:text-blue-600'
        >
          LOGIN HERE
        </Link>
      </p>
    </div>
  </div>
);

};

export default HarfZaarRegister;
