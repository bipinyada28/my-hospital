// server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  verified: { type: Boolean, default: false }, // for OTP verification
  otp: String,
  otpExpires: Date,
});

export default mongoose.model('User', userSchema);
