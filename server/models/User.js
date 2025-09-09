// server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  verified: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  otp: String,
  otpExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  specialty: { type: String },      // new
  department: { type: String },     // new
  experience: Number,      // years of experience
  bio: String,             // short description
  location: String,        // e.g. "Building A, Floor 3" 
  timing: String,          // "Mon–Fri 8AM–5PM"
  patients: String,        // "2,500+"
  specializations: [String],
  photoUrl: String         // doctor profile image

}, { timestamps: true });

export default mongoose.model('User', userSchema);
