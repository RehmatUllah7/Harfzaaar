//authRoutes.js file
import { Router } from 'express';
const router = Router();
import { registerUser, loginUser, changePasswordViaPassword } from '../controllers/authController.js';
import { getUserInfo } from '../controllers/authController.js';  // Import the new controller function
import { forgotPassword } from '../controllers/authController.js';
import { verifyOtp } from '../controllers/authController.js';
import { changePassword } from '../controllers/authController.js';
import { verifyEmail } from '../controllers/authController.js';


// Route to handle sending OTP
router.post('/forgot-password', forgotPassword);

// Route to handle OTP verification
router.post('/verify-otp', verifyOtp);

// Route to handle password change
router.post('/change-password', changePassword);
router.post('/change-passwordviapassword', changePasswordViaPassword);


router.post('/signup', registerUser);
router.post('/login', loginUser);

router.post('/verify-email', verifyEmail);
// New route to get logged-in user's info
router.get('/user-info', getUserInfo);  // Add this route

export default router;
