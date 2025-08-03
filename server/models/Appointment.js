// server/models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },   // used to link appointments
  firstName: String,
  lastName: String,
  phone: String,
  dob: String,
  insurance: String,
  department: String,
  doctor: String,
  reason: String,
  date: String,
  time: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Appointment', appointmentSchema);
