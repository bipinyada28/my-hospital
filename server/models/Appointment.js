// server/models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },    // new
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // new
  status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Completed', 'Cancelled'],
    default: 'Confirmed',
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Appointment', appointmentSchema);
