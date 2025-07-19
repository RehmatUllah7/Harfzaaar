import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from React Icons
import { useNavigate } from 'react-router-dom';

const PasswordChangeForm = ({ onSubmitPassword }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();

  // Regular expression to validate the password strength
  const passwordValidationRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

  useEffect(() => {
    // Validate password and confirm password whenever they change
    validatePassword();
  }, [password, confirmPassword]);

  const validatePassword = () => {
    // Check if password meets the required conditions
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      setIsPasswordValid(false);
      return;
    }

    if (!password.match(passwordValidationRegEx)) {
      setPasswordError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      setIsPasswordValid(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      setIsPasswordValid(false);
      return;
    }

    // If all conditions are met
    setPasswordError('');
    setIsPasswordValid(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isPasswordValid && password === confirmPassword) {
      // Send password to parent component for updating in the database
      onSubmitPassword(password);
      navigate('/login');
    }
  };

  return (
    <div className='mt-8 flex flex-col items-center justify-center rounded-lg bg-gray-800 p-6 shadow-lg'>
      <div className='mb-4 text-2xl text-white'>Change Your Password</div>
      <div className='w-full max-w-md rounded-lg bg-gray-700 p-8'>
        <div className='relative mb-6'>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle between text and password for the new password field
            placeholder='New Password'
            value={password}
            onChange={handlePasswordChange}
            className='w-full rounded-lg border border-gray-500 bg-gray-600 px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
          <span
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility for the new password
            className='absolute right-4 top-3 cursor-pointer text-gray-400'
          >
            {showPassword ? (
              <FaEyeSlash className='h-6 w-6' /> // Eye icon for password visibility
            ) : (
              <FaEye className='h-6 w-6' /> // Eye icon for password visibility
            )}
          </span>
        </div>

        <div className='relative mb-6'>
          <input
            type={showConfirmPassword ? 'text' : 'password'} // Toggle between text and password for the confirm password field
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className='w-full rounded-lg border border-gray-500 bg-gray-600 px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirm password visibility
            className='absolute right-4 top-3 cursor-pointer text-gray-400'
          >
            {showConfirmPassword ? (
              <FaEyeSlash className='h-6 w-6' /> // Eye icon for password visibility
            ) : (
              <FaEye className='h-6 w-6' /> // Eye icon for password visibility
            )}
          </span>
        </div>

        {passwordError && (
          <p className='mb-6 text-sm text-red-500'>{passwordError}</p>
        )}

        <button
          type='submit'
          onClick={handleSubmit}
          className={`w-full rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 py-3 text-lg font-semibold text-white shadow-md ${!isPasswordValid ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={!isPasswordValid}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
