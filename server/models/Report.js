import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who uploaded
  fileUrl: { type: String, required: true },                      // storage url/path
  note: { type: String },
  status: { type: String, enum: ['Pending', 'Ready', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Report', reportSchema);
