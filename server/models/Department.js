import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  patients: { type: String, default: "0" },
  specialists: { type: Number, default: 0 },
  timing: { type: String, default: "By Appointment" },
  icon: { type: String }, // e.g. "FaHeartbeat"
  color: { type: String }, // hex or Tailwind color
  // Removed 'rating' field
});

export default mongoose.model("Department", departmentSchema);