import React, { useState, useEffect } from 'react';

const OtpInputForm = ({ onSubmitOtp, onResendOtp }) => {
  const [otp, setOtp] = useState(Array(6).fill('')); // OTP is an array of 6 values (one for each box)
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false); // State to disable resend button
  const [cooldown, setCooldown] = useState(30); // Cooldown timer in seconds

  useEffect(() => {
    setIsOtpValid(otp.every((digit) => digit !== '')); // Update OTP validity
  }, [otp]);

  useEffect(() => {
    let timer;
    if (resendDisabled && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1); // Decrease cooldown every second
      }, 1000);
    } else if (cooldown === 0) {
      setResendDisabled(false); // Enable resend button when cooldown ends
      setCooldown(30); // Reset cooldown timer
    }
    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [resendDisabled, cooldown]);

  const handleChange = (e, index) => {
    let value = e.target.value;

    if (!/^[0-9]$/.test(value) && value !== '') {
      return; // Ensure only numbers are allowed and allow empty input for delete
    }

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus on next input field if a digit is entered
    if (value !== '' && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    // If the value is empty, we don't move focus and allow deletion
    if (value === '') {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOtpValid) {
      const otpCode = otp.join(''); // Combine the OTP array into a string
      console.log('Submitted OTP:', otpCode); // Debugging line
      onSubmitOtp(otpCode); // Pass the OTP code to the parent component
    }
  };

  const handleResendClick = () => {
    setResendDisabled(true); // Disable resend button
    onResendOtp(); // Trigger the resend OTP function
  };

  return (
    <div className="flex justify-center items-center flex-col p-6 bg-gray-800 rounded-lg shadow-lg mt-8">
      <div className="text-2xl text-white mb-4">Enter OTP</div>
      <div className="flex space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onFocus={(e) => e.target.select()} // Automatically select text when focused
            className="w-12 h-12 text-center text-2xl bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
          />
        ))}
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className={`w-full px-4 py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-purple-600 rounded-lg shadow-md mt-4 ${
          isOtpValid ? '' : 'opacity-50 cursor-not-allowed'
        }`}
        disabled={!isOtpValid}
      >
        Confirm OTP
      </button>
      <button
        type="button"
        onClick={handleResendClick}
        disabled={resendDisabled}
        className={`text-gray-400 mt-2 ${
          resendDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-purple-500'
        }`}
      >
        {resendDisabled ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
      </button>
    </div>
  );
};

export default OtpInputForm;