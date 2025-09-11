// server/controllers/drController.js
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Report from "../models/Report.js";

/**
 * @desc Get consolidated doctor dashboard data
 * @route GET /api/doctor/dashboard
 */
export const getDoctorDashboardData = async (req, res) => {
  try {
    const doctorId = req.userId;

    const doctor = await User.findById(doctorId).select("-password").lean();
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointments = await Appointment.find({ doctorId })
      .populate("userId", "name email phone")
      .sort({ date: 1, time: 1 })
      .lean();
      
    const patientIds = await Appointment.distinct("userId", { doctorId });
    const patients = await User.find({ _id: { $in: patientIds } }).select("-password").lean();

    const reports = await Report.find({ doctorId })
      .populate("patientId", "name email")
      .sort({ createdAt: -1 })
      .lean();
    
    // Calculate metrics
    const totalAppointments = appointments.length;
    const totalPatients = patients.length;
    const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().slice(0, 10)).length;

    res.json({
      profile: doctor,
      appointments,
      patients,
      reports,
      metrics: {
        totalAppointments,
        totalPatients,
        todayAppointments,
        totalReports: reports.length,
      },
    });
  } catch (err) {
    console.error("❌ getDoctorDashboardData error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update doctor profile
 * @route PATCH /api/doctor/profile
 */
export const updateDoctorProfile = async (req, res) => {
  try {
    const { name, phone, specialty, department, experience, bio, timing } = req.body;
    const updates = { name, phone, specialty, department, experience, bio, timing };

    const doctor = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("❌ updateDoctorProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update appointment status
 * @route PATCH /api/doctor/appointments/:id/status
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctorId: req.userId }, // Ensure only the authorized doctor can update
      { status },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not authorized" });
    }

    res.json(appointment);
  } catch (err) {
    console.error("❌ updateAppointmentStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Create a new report
 * @route POST /api/doctor/reports
 */
export const createReport = async (req, res) => {
  try {
    const { patientId, title, note, fileUrl } = req.body;
    const doctorId = req.userId;

    const newReport = new Report({
      patientId,
      doctorId,
      title,
      note,
      fileUrl,
    });

    await newReport.save();

    res.status(201).json({ message: "Report created successfully", report: newReport });
  } catch (err) {
    console.error("❌ createReport error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get doctor's patients
 * @route GET /api/doctor/patients
 */
export const getDoctorPatients = async (req, res) => {
  try {
    const patientIds = await Appointment.distinct("userId", { doctorId: req.userId });
    const patients = await User.find({ _id: { $in: patientIds } }).select("-password");
    res.json(patients);
  } catch (err) {
    console.error("❌ getDoctorPatients error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get doctor's reports
 * @route GET /api/doctor/reports
 */
export const getDoctorReports = async (req, res) => {
  try {
    const reports = await Report.find({ doctorId: req.userId })
      .populate("patientId", "name email");
    res.json(reports);
  } catch (err) {
    console.error("❌ getDoctorReports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};