import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';
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
      const verifyResponse = await fetch(
        'http://localhost:5000/api/auth/verify-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

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
      const otpResponse = await fetch(
        'http://localhost:5000/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

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
      const response = await fetch(
        'http://localhost:5000/api/auth/verify-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: emailForPasswordChange, otp }),
        }
      );

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
      const response = await fetch(
        'http://localhost:5000/api/auth/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailForPasswordChange, // Assuming the email is saved from previous steps
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Notify user that the password has been changed successfully
        setTimeout(() => navigate('/login'), 3000);
        // Optionally, redirect to the login page or other screen
      } else {
        alert(data.message || 'Failed to change password.');
      }
    } catch (error) {
      alert('An error occurred while changing the password.');
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
      <h1 className='mb-6 text-4xl font-extrabold text-white drop-shadow-lg md:text-6xl'>
        HarfZaad
      </h1>

      {showOtpForm && (
        <OtpInputForm
          onSubmitOtp={handleSubmitOtp}
          onResendOtp={handleResendOtp}
        />
      )}

      {showPasswordForm && (
        <PasswordChangeForm onSubmitPassword={handleSubmitPassword} />
      )}

      {!showOtpForm && !showPasswordForm && (
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-sm rounded-2xl bg-gray-800 bg-opacity-95 p-6 shadow-2xl sm:max-w-md sm:p-8'
        >
          <div className='mb-5'>
            <input
              type='email'
              value={email}
              onChange={handleEmailChange}
              placeholder='Enter Email'
              className='w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          </div>

          {emailError && (
            <p className='mb-5 text-sm text-red-500'>{emailError}</p>
          )}
          {message && (
            <p className='mb-5 text-sm text-green-500'>{message}</p>
          )}

          <button
            type='submit'
            className={`w-full rounded-lg bg-gradient-to-r from-red-500 to-purple-600 px-4 py-3 text-base font-semibold text-white shadow-md transition duration-300 hover:from-red-600 hover:to-purple-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'RESET PASSWORD'}
          </button>
        </form>
      )}
    </div>
  </div>
);

};

export default HarfZaarResetPassword;
