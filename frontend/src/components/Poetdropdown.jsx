
import { Link, useNavigate } from "react-router-dom";
import pic from "../assets/images/profile.png.png";
import React, { useState, useEffect, useRef } from "react";

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
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo({
          ...data,
          username: username || data.username // Use stored username if available
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
      navigate('/');
      return;
    }

    try {
      setIsLoggingOut(true);

      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setIsOpen(false);
        navigate('/');
      } else {
        console.error('Failed to logout properly.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Picture Section */}
      <button
        onClick={toggleDropdown}
        className="inline-block w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer hover:scale-105 transition-transform"
      >
        <img
          src={pic}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg z-10">
          {/* Close Button */}
          <button
            onClick={closeDropdown}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
          >
            ×
          </button>

          {/* Name Section */}
          <div className="py-4 px-4 text-xl font-semibold text-gray-800">
            {errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              userInfo && userInfo.username ? capitalizeName(userInfo.username) : 'Loading...'
            )}
          </div>
          <hr className="border-gray-300" />

          {/* Menu Items */}
          <div className="px-4 py-2">
          <Link
              to="/mypoetry"
              className="relative block py-2 px-4 text-gray-600 hover:bg-purple-500 hover:text-white transition-all hover:translate-x-3"
            >
              Manage My Poetry
            </Link>
          <Link
              to="/mynews"
              className="relative block py-2 px-4 text-gray-600 hover:bg-purple-500 hover:text-white transition-all hover:translate-x-3"
            >
              Manage My News
            </Link>
           
            <Link
              to="/viapassword"
              className="relative block py-2 px-4 text-gray-600 hover:bg-purple-500 hover:text-white transition-all hover:translate-x-3"
            >
              Change Password
            </Link>
           
            <Link
              to="/feedback"
              className="relative block py-2 px-4 text-gray-600 hover:bg-purple-500 hover:text-white transition-all hover:translate-x-3"
            >
              Feedback
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`relative w-full text-left block py-2 px-4 ${
                isLoggingOut ? 'text-gray-400' : 'text-gray-600 hover:bg-purple-500 hover:text-white'
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
