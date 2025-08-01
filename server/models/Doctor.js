import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  image: String,
  availableDays: [String],  // e.g., ["Monday", "Wednesday"]
  description: String,
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);
