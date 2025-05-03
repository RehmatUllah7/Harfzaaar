import React, { useState } from 'react';
import logo from "../../assets/logo.jpg";
import OtpInputForm from './OtpInputForm'; // Import OTP form
import PasswordChangeForm from './PasswordChangeForm'; // Import Password Change form
import { useNavigate } from 'react-router-dom';

const HarfZaarResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // To toggle password form
  const [otpCode, setOtpCode] = useState('');
  const [emailForPasswordChange, setEmailForPasswordChange] = useState(''); // Store email for password change

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError('');
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEmailError('');
    setMessage('');
    setIsLoading(true);

    try {
      const verifyResponse = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setEmailError(verifyData.message || 'Email verification failed.');
        setIsLoading(false);
        return;
      }

      // Send OTP to the email
      await sendOtp(email);
    } catch (error) {
      setEmailError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send OTP
  const sendOtp = async (email) => {
    try {
      const otpResponse = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const otpData = await otpResponse.json();

      if (otpResponse.ok) {
        setMessage('OTP sent successfully. Please check your email.');
        setShowOtpForm(true);
        setOtpCode(otpData.otp);
        setEmailForPasswordChange(email); // Store the email for password change
      } else {
        setEmailError(otpData.message || 'Failed to send OTP.');
      }
    } catch (error) {
      setEmailError('An error occurred. Please try again.');
    }
  };

  // Function to handle resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setMessage('Resending OTP...');
    try {
      await sendOtp(emailForPasswordChange); // Resend OTP to the same email
      setMessage('OTP resent successfully. Please check your email.');
    } catch (error) {
      setEmailError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOtp = async (otp) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailForPasswordChange, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('OTP matched');
        setShowOtpForm(false); // Hide OTP form
        setShowPasswordForm(true); // Show password form
      } else {
        alert(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while verifying OTP.');
    }
  };

  const handleSubmitPassword = async (newPassword) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailForPasswordChange, // Assuming the email is saved from previous steps
          newPassword: newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Notify user that the password has been changed successfully
        setTimeout(() => navigate('/'), 3000);
        // Optionally, redirect to the login page or other screen
      } else {
        alert(data.message || 'Failed to change password.');
      }
    } catch (error) {
      alert('An error occurred while changing the password.');
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
        {showOtpForm && (
          <OtpInputForm onSubmitOtp={handleSubmitOtp} onResendOtp={handleResendOtp} />
        )}
        {showPasswordForm && (
          <PasswordChangeForm onSubmitPassword={handleSubmitPassword} />
        )}
        {!showOtpForm && !showPasswordForm && (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-gray-800 bg-opacity-95 p-8 rounded-2xl shadow-2xl"
          >
            <div className="mb-6">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter Email"
                className="w-full px-4 py-3 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {emailError && <p className="text-red-500 text-sm mb-6">{emailError}</p>}
            {message && <p className="text-green-500 text-sm mb-6">{message}</p>}
            <button
              type="submit"
              className={`w-full px-4 py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-purple-600 rounded-lg shadow-md ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'RESET PASSWORD'}
            </button>
            <button
  onClick={() => navigate('/')}
  className="absolute top-6 left-6 px-3 py-1 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-lg shadow"
>
  Go Back
</button>

          </form>
        )}
      </div>
    </div>
  );
};

export default HarfZaarResetPassword;