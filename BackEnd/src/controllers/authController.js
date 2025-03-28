// authController.js file
import jwt from 'jsonwebtoken'; // Use the default import
import User from '../models/User.js';
import dotenv from 'dotenv'; // Import dotenv
import crypto from 'crypto'; // For OTP generation
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'

dotenv.config(); // Load environment variables



export const changePasswordViaPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Validate inputs
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not registered." });
    }

    // Ensure user has a stored password
    if (!user.password) {
      return res.status(500).json({ message: "Password not set in database." });
    }

    // Verify old password using bcrypt
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password." });
    }

    // Validate new password strength (at least 8 characters, 1 uppercase, 1 number)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long, contain 1 uppercase letter, and 1 number." });
    }

    user.password = newPassword; 
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });

  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Failed to change password. Please try again." });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Step 1: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Step 2: Check if OTP matches and is not expired
    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (new Date(user.otp.expiry) < new Date()) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    // Step 3: Respond with success
    res.status(200).json({ message: 'OTP matched. You can now set a new password.' });
  } catch (error) {
    console.error('OTP verification failed:', error.message || error);
    res.status(500).json({ message: 'Failed to verify OTP.', error: error.message });
  }
};


export const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // The pre-save hook will automatically hash the password when saving
    user.password = newPassword; // Set the new password directly

    // Save the user document with the updated password
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Failed to change password.' });
  }
};








export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Step 1: Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not registered.' });
    }

    // Step 2: Generate a 6-digit OTP and expiry time
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // OTP valid for 2 minutes

    // Step 3: Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: 'harfzaar360@gmail.com', 
        pass: 'wifv tnzs udbo xwkx', 
      },
    });

    // Step 4: Compose the email
    const mailOptions = {
      from: process.env.SMTP_EMAIL || 'harfzaar360@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for password reset is: ${otp}. It is valid for 2 minutes.`,
    };

    // Step 5: Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');

    // Step 6: Update user's OTP and expiry in the database
    user.otp = { code: otp, expiry: otpExpiry };
    await user.save();

    // Step 7: Respond with success
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Failed to send OTP email:', error.message || error);
    res.status(500).json({ message: 'Failed to send OTP email.', error: error.message });
  }
};


export const verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not registered.' });
    }
    res.status(200).json({ message: 'Email exists.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // Check if password matches
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  // Generate JWT token using the 'sign' function from jwt
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({
    message: 'Login successful',
    token,
  });
};


// New function to get user info
export const getUserInfo = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    // Verify token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user information from the database
    const user = await User.findById(userId).select('username email');  // Select only username and email

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user info
    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};


export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Create and save new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
};
