import { Link, useNavigate } from 'react-router-dom';
import pic from '../assets/images/profile.png.png';
import React, { useState, useEffect, useRef } from 'react';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = async () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      await fetchUserInfo();
    }
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const fetchUserInfo = async () => {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');

    if (!token) {
      setErrorMessage('You are not logged in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/user-info', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo({
          ...data,
          username: username || data.username, // Use stored username if available
        });
        setErrorMessage('');
      } else {
        // If API call fails but we have username in localStorage, still show it
        if (username) {
          setUserInfo({ username });
          setErrorMessage('');
        } else {
          setErrorMessage(data.message || 'Failed to fetch user info.');
        }
      }
    } catch (error) {
      // If API call fails but we have username in localStorage, still show it
      if (username) {
        setUserInfo({ username });
        setErrorMessage('');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setIsLoggingOut(true);

      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setIsOpen(false);
        navigate('/login');
      } else {
        console.error('Failed to logout properly.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Profile Picture Section */}
      <button
        onClick={toggleDropdown}
        className='inline-block h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-white transition-transform hover:scale-105'
      >
        <img src={pic} alt='Profile' className='h-full w-full object-cover' />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute right-0 z-10 mt-2 w-64 rounded-lg bg-white text-black shadow-lg'>
          {/* Close Button */}
          <button
            onClick={closeDropdown}
            className='absolute right-2 top-2 text-xl text-gray-600 hover:text-gray-800'
          >
            ×
          </button>

          {/* Name Section */}
          <div className='px-4 py-4'>
            <div className='text-xl font-semibold text-gray-800'>
              {errorMessage ? (
                <p className='text-red-500'>{errorMessage}</p>
              ) : userInfo && userInfo.username ? (
                capitalizeName(userInfo.username)
              ) : (
                'Loading...'
              )}
            </div>
            <div className='text-sm font-medium text-purple-600'>Poet</div>
          </div>
          <hr className='border-gray-300' />

          {/* Menu Items */}
          <div className='px-4 py-2'>
            <Link
              to='/addpoetry'
              className='relative block px-4 py-2 text-gray-600 transition-all hover:translate-x-3 hover:bg-purple-500 hover:text-white'
            >
              Add Poetry
            </Link>
            <Link
              to='/addnews'
              className='relative block px-4 py-2 text-gray-600 transition-all hover:translate-x-3 hover:bg-purple-500 hover:text-white'
            >
              Add News
            </Link>

            <Link
              to='/viapassword'
              className='relative block px-4 py-2 text-gray-600 transition-all hover:translate-x-3 hover:bg-purple-500 hover:text-white'
            >
              Change Password
            </Link>

            <Link
              to='/feedback'
              className='relative block px-4 py-2 text-gray-600 transition-all hover:translate-x-3 hover:bg-purple-500 hover:text-white'
            >
              Feedback
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`relative block w-full px-4 py-2 text-left ${
                isLoggingOut
                  ? 'text-gray-400'
                  : 'text-gray-600 hover:bg-purple-500 hover:text-white'
              } transition-all hover:translate-x-3`}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

// Capitalize First Letter
const capitalizeName = (name) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
