import express from 'express';
import {
  register,
  verifyOTP,
  login,
  addDoctor,
  getCurrentUser,
} from '../controllers/authController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', register);         // Step 1: Register with email + send OTP
router.post('/verify-otp', verifyOTP);      // Step 2: Submit OTP to complete registration
router.post('/login', login);               // Step 3: Login

// Admin-only: Add new doctor
router.post('/add-doctor', addDoctor);

// Protected: Dashboard data
router.get('/me', authMiddleware, getCurrentUser);

export default router;

