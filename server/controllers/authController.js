// server/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Appointment from '../models/Appointment.js';


const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// REGISTER
// REGISTER (with resend OTP if not verified)
export const register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  // ✅ Phone number validation
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
  }

  try {
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.verified) {
        // ✅ Already verified
        return res.status(400).json({ message: 'Email already registered' });
      } else {
        // ⚠ Not verified → resend OTP
        const otp = generateOTP();
        existingUser.otp = otp;
        existingUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await existingUser.save();

        // Send OTP email again
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `True Heal Hospital <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'OTP Verification - True Heal',
          html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP resent to your email.' });
      }
    }

    // 🆕 New user case
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'patient',
      verified: false,
      otp,
      otpExpires,
    });

    await newUser.save();

    // Send OTP email for new user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `True Heal Hospital <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'OTP Verification - True Heal',
      html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to email.' });

  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

        // 🔗 Link past appointments for this user
    await Appointment.updateMany(
      { userEmail: user.email.toLowerCase().trim(), userId: null },
      { $set: { userId: user._id } }
    );

    res.status(200).json({ message: '✅ OTP verified and registration completed' });

  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found, pls Register.' });

    // ✅ Block login if not verified
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account has been deactivated by the admin.' });
    }

    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // ✅ Link old guest appointments to this user
    await Appointment.updateMany(
      { userEmail: user.email.toLowerCase().trim(), userId: null },
      { $set: { userId: user._id } }
    );

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// ADD DOCTOR
export const addDoctor = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Doctor already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const doctor = new User({
      name,
      email,
      phone,
      password: hashed,
      role: 'doctor',
      verified: true,
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully' });

  } catch (error) {
    console.error('❌ Add Doctor Error:', error);
    res.status(500).json({ message: 'Failed to add doctor' });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

// ADD THE FORGOT PASSWORD FUNCTION
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: `True Heal Hospital <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - True Heal',
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
             <p>This link will expire in 15 minutes.</p>`
    });

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error('❌ Forgot Password Error:', err);
    res.status(500).json({ message: 'Error sending password reset link' });
  }
};

// ADD THE RESET PASSWORD FUNCTION
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('❌ Reset Password Error:', err);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
