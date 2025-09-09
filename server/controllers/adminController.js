// server/controllers/adminController.js

import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Report from '../models/Report.js';
import bcrypt from 'bcryptjs';


// Get all doctors (from User collection)
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .populate("department", "name description")
      .select("-password")
      .lean();

    res.json(doctors.map(normalizeDoc));
  } catch (error) {
    console.error("❌ Failed to fetch doctors:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};


// --- Helper to normalize Mongoose documents ---
const normalizeDoc = (doc) => {
    if (!doc) return null;
    const transformed = doc.toObject ? doc.toObject() : doc;
    transformed.id = transformed._id;
    delete transformed._id;
    delete transformed.__v;
    return transformed;
};

// Get metrics summary (total counts)
// Get metrics summary (total counts + charts)
export const getMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });

    // Count today's appointments
    const todayAppointments = await Appointment.countDocuments({
      date: new Date().toISOString().slice(0, 10) // only yyyy-mm-dd part
    });

    const pendingReports = await Report.countDocuments({ status: 'Pending' });

    // 1. Appointments by Status (Pie Chart)
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 2. Patients Registered per Month (Line Chart)
    const patientsByMonth = await User.aggregate([
      { $match: { role: "patient" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          patients: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Send metrics response
    res.json({
      totalUsers,
      totalDoctors,
      todayAppointments,
      pendingReports,

      // Chart data
      appointmentsByStatus: appointmentsByStatus.map(x => ({
        status: x._id,
        count: x.count
      })),
      patientsByMonth: patientsByMonth.map(x => ({
        month: x._id,
        patients: x.patients
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch metrics' });
  }
};


// User APIs

// List users with optional filters (role, status)
export const getUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') filter.status = status;

    const users = await User.find(filter).select('-password').lean();
    res.json(users.map(normalizeDoc)); // --- FIXED: Normalize documents
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Create user (doctor, patient, admin)
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, specialty } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword, role, specialty, status: 'active' }); // Added default status
    await user.save();

    const userToReturn = normalizeDoc(user); // --- FIXED: Normalize before returning
    delete userToReturn.password;
    res.status(201).json(userToReturn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Toggle user status active/inactive
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();
    res.json({ message: 'User status updated', status: user.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Appointments APIs

// List appointments with optional filtering
export const getAppointments = async (req, res) => {
  try {
    const { status, doctor } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    // FIX: Match 'doctor' query param to 'doctorId' field
    if (doctor && doctor !== 'all') {
      const doctorUser = await User.findOne({ role: 'doctor', name: doctor });
      if (doctorUser) {
        filter.doctorId = doctorUser._id;
      }
    }

    const appointments = await Appointment.find(filter)
      .populate('userId', 'name email')
      .populate('doctorId', 'name specialty')
      .sort({ date: 1, time: 1 })
      .lean();
      
    res.json(appointments.map(normalizeDoc)); // --- FIXED: Normalize documents
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    // FIX: Check if the request body contains a status
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // FIX: Set the status from the request body
    appointment.status = status;
    await appointment.save();
    res.json({ message: 'Appointment status updated', status: appointment.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update appointment status' });
  }
};

// Reports APIs

// List reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reports.map(normalizeDoc)); // --- FIXED: Normalize documents
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

// Upload report for a patient (multipart form-data)
export const uploadReport = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const doctorId = req.userId;

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const newReport = new Report({
      title: req.body.title,
      patientId,
      doctorId,
      fileUrl: req.file.path,
      note: req.body.note,
    });
    await newReport.save();

    const reportToReturn = normalizeDoc(newReport); // --- FIXED: Normalize before returning
    res.status(201).json(reportToReturn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload report' });
  }
};


// Approve report
export const approveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = 'Ready';
    await report.save();
    res.json({ message: 'Report approved', status: report.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve report' });
  }
};

// Reject report
export const rejectReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = 'Rejected';
    await report.save();
    res.json({ message: 'Report rejected', status: report.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject report' });
  }
};