// server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  phone: {
    type: String,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },

  verified: {
    type: Boolean,
    default: false,
  },

  otp: String,

  otpExpires: Date,

  // Adding new fields here
  resetPasswordToken: {
    type: String,
  },

  resetPasswordExpires: {
    type: Date,
  },

}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);
