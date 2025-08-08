// server/routes/authRoutes.js
import express from 'express';
import {
  register,
  verifyOTP,
  login,
  addDoctor,
  getCurrentUser,
  forgotPassword,      // Import the new forgotPassword function
  resetPassword        // Import the new resetPassword function
} from '../controllers/authController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);        // Send OTP
router.post('/verify-otp', verifyOTP);     // Verify OTP
router.post('/login', login);              // Login

// New routes for password reset
router.post('/forgot-password', forgotPassword);   // Forgot Password route
router.post('/reset-password', resetPassword);    // Reset Password route

// Protected routes
router.post('/add-doctor', authMiddleware, addDoctor);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
