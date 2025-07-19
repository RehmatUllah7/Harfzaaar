import React, { useState, useEffect } from 'react';
import Header from '@/components/home/Header';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BecomePoet = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(''); // Add state for username

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to become a poet');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          'http://localhost:5000/api/auth/user-info',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Check if user is already a poet
        if (response.data.role === 'poet') {
          toast.error('You are already registered as a poet');
          navigate('/home');
          return;
        }

        // Set user data
        setUserId(response.data.userId);
        setUserRole(response.data.role);
        setUsername(response.data.username); // Set the username from response
        setLoading(false);

        // Initialize form data with username as poetName
        setFormData((prev) => ({
          ...prev,
          poetName: response.data.username,
        }));
      } catch (error) {
        console.error('Error fetching user info:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          toast.error('Session expired. Please login again');
          navigate('/login');
        } else {
          toast.error('Error fetching user info');
        }
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const [formData, setFormData] = useState({
    poetName: '', // Will be populated with username
    poetryDomain: 'Ghazal',
    poetryTitle: '',
    poetryContent: '',
    genre: 'Romantic',
  });

  const [errors, setErrors] = useState({
    poetName: '',
    poetryTitle: '',
    poetryContent: '',
  });

  const isUrduText = (text) => /^[\u0600-\u06FF\s]+$/.test(text);
  const isEnglishText = (text) => /^[a-zA-Z\s]+$/.test(text);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Remove poetName from editable fields
    if (name !== 'poetName') {
      if (name === 'poetryTitle' || name === 'poetryContent') {
        if (value && !isUrduText(value)) {
          setErrors((prev) => ({
            ...prev,
            [name]: 'Only Urdu text is allowed.',
          }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
      }

      setFormData({ ...formData, [name]: value });
    }
  };

  const allFieldsFilled = Object.values(formData).every(
    (val) => val.trim() !== ''
  );
  const noErrors = Object.values(errors).every((err) => err === '');
  const isFormValid = allFieldsFilled && noErrors;

  const handleNext = () => {
    if (!isFormValid) {
      toast.error('Please fill out all fields correctly before proceeding.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login to become a poet');
      navigate('/login');
      return;
    }

    if (!userId) {
      toast.error('User ID not found. Please try logging in again.');
      navigate('/login');
      return;
    }

    const dataToStore = {
      poetName: formData.poetName, // This will be the username
      poetryDomain: formData.poetryDomain,
      poetryTitle: formData.poetryTitle,
      poetryContent: formData.poetryContent,
      genre: formData.genre,
      userId: userId,
    };

    console.log('Storing data for next form:', dataToStore);
    localStorage.setItem('becomePoetData', JSON.stringify(dataToStore));
    navigate('/becomepoet2', { state: dataToStore });
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 via-black to-purple-900 text-white'>
        <div className='text-center'>
          <div className='animate-spin mx-auto h-12 w-12 rounded-full border-b-2 border-t-2 border-purple-500'></div>
          <p className='mt-4'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-r from-gray-900 via-black to-purple-900 text-white'>
      <Header />
      <div className='mx-auto mt-10 max-w-2xl rounded-lg bg-white p-8 text-black shadow-lg'>
        <h2 className='mb-6 text-center text-3xl font-bold text-gray-800'>
          Become a Poet
        </h2>
        <p className='mb-8 text-center text-gray-600'>
          Share your poetry with the world. Fill out the form below to submit
          your work.
        </p>

        <form className='space-y-4'>
          <div>
            <label className='block font-semibold text-gray-700'>
              Poet Name
            </label>
            <input
              type='text'
              name='poetName'
              value={formData.poetName}
              readOnly // Make the field read-only
              className='mt-1 w-full cursor-not-allowed rounded-lg border bg-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
            <p className='mt-1 text-sm text-gray-500'>
              Your poet name is set as your username
            </p>
          </div>

          <div>
            <label className='block font-semibold text-gray-700'>
              Poetry Domain
            </label>
            <select
              name='poetryDomain'
              value={formData.poetryDomain}
              onChange={handleChange}
              required
              className='mt-1 w-full rounded-lg border bg-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500'
            >
              <option value='Ghazal'>Ghazal</option>
              <option value='Nazm'>Nazm</option>
              <option value='Rubai'>Rubai</option>
              <option value='Marsiya'>Marsiya</option>
            </select>
          </div>

          <div>
            <label className='block font-semibold text-gray-700'>
              Poetry Title
            </label>
            <input
              type='text'
              name='poetryTitle'
              value={formData.poetryTitle}
              onChange={handleChange}
              placeholder='شاعری کا عنوان لکھیں'
              required
              className='urdu-font mt-1 w-full rounded-lg border bg-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
            {errors.poetryTitle && (
              <p className='mt-1 text-sm text-red-500'>{errors.poetryTitle}</p>
            )}
          </div>

          <div>
            <label className='block font-semibold text-gray-700'>
              Your Poetry
            </label>
            <textarea
              name='poetryContent'
              value={formData.poetryContent}
              onChange={handleChange}
              placeholder='اپنی شاعری یہاں لکھیں...'
              required
              rows='5'
              className='urdu-font mt-1 w-full rounded-lg border bg-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500'
            ></textarea>
            {errors.poetryContent && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.poetryContent}
              </p>
            )}
          </div>

          <div>
            <label className='block font-semibold text-gray-700'>Genre</label>
            <select
              name='genre'
              value={formData.genre}
              onChange={handleChange}
              required
              className='mt-1 w-full rounded-lg border bg-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-purple-500'
            >
              <option value='Romantic'>Romantic</option>
              <option value='Mystical'>Mystical</option>
              <option value='Philosophical'>Philosophical</option>
              <option value='Revolutionary'>Revolutionary</option>
            </select>
          </div>

          <button
            type='button'
            onClick={handleNext}
            disabled={!isFormValid}
            className={`w-full transform rounded-lg px-6 py-3 font-bold transition-transform ${
              isFormValid
                ? 'bg-purple-600 text-white hover:scale-105 hover:bg-purple-700'
                : 'cursor-not-allowed bg-gray-400 text-white'
            }`}
          >
            Next
          </button>
        </form>
      </div>

      <style>
        {`
          .urdu-font {
            font-family: "Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", serif;
            font-size: 20px;
            direction: rtl;
            text-align: right;
          }
        `}
      </style>
    </div>
  );
};

export default BecomePoet;
