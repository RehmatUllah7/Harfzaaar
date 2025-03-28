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
  const passwordValidationRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

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
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
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
      navigate('/'); 
    }
  };

  return (
    <div className="flex justify-center items-center flex-col p-6 bg-gray-800 rounded-lg shadow-lg mt-8">
      <div className="text-2xl text-white mb-4">Change Your Password</div>
      <div className="w-full max-w-md bg-gray-700 p-8 rounded-lg">
        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password for the new password field
            placeholder="New Password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full px-4 py-3 text-gray-300 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility for the new password
            className="absolute right-4 top-3 cursor-pointer text-gray-400"
          >
            {showPassword ? (
              <FaEyeSlash className="w-6 h-6" /> // Eye icon for password visibility
            ) : (
              <FaEye className="w-6 h-6" /> // Eye icon for password visibility
            )}
          </span>
        </div>

        <div className="mb-6 relative">
          <input
            type={showConfirmPassword ? "text" : "password"} // Toggle between text and password for the confirm password field
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="w-full px-4 py-3 text-gray-300 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirm password visibility
            className="absolute right-4 top-3 cursor-pointer text-gray-400"
          >
            {showConfirmPassword ? (
              <FaEyeSlash className="w-6 h-6" /> // Eye icon for password visibility
            ) : (
              <FaEye className="w-6 h-6" /> // Eye icon for password visibility
            )}
          </span>
        </div>

        {passwordError && <p className="text-red-500 text-sm mb-6">{passwordError}</p>}

        <button
          type="submit"
          onClick={handleSubmit}
          className={`w-full px-4 py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-purple-600 rounded-lg shadow-md ${!isPasswordValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isPasswordValid}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default PasswordChangeForm;


