// server/controllers/patientController.js
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Report from "../models/Report.js";

/**
 * @desc Get patient profile
 * @route GET /api/patient/me
 */
export const getProfile = async (req, res) => {
  try {
    const patient = await User.findById(req.userId).select("-password");
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    console.error("❌ getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update patient profile
 * @route PATCH /api/patient/me
 */
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const patient = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (err) {
    console.error("❌ updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get patient's appointments
 * @route GET /api/patient/me/appointments
 */
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId })
      .populate("doctorId", "name specialty department")
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (err) {
    console.error("❌ getAppointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Cancel appointment
 * @route DELETE /api/patient/appointments/:id
 */
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled", status: appointment.status });
  } catch (err) {
    console.error("❌ cancelAppointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get patient's reports
 * @route GET /api/patient/me/reports
 */
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.userId })
      .populate("doctorId", "name specialty")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error("❌ getReports error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Download single report
 * @route GET /api/patient/reports/:id/download
 */
export const downloadReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      patientId: req.userId,
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.download(report.fileUrl); // works if fileUrl is local path
  } catch (err) {
    console.error("❌ downloadReport error:", err);
    res.status(500).json({ message: "Failed to download report" });
  }
};

/**
 * @desc Book a new appointment
 * @route POST /api/patient/appointments
 */
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason, notes } = req.body;

    // find patient info
    const patient = await User.findById(req.userId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    // validate doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const newAppointment = new Appointment({
      userId: req.userId,
      userEmail: patient.email,          // ✅ required field
      firstName: patient.name.split(" ")[0] || "",
      lastName: patient.name.split(" ")[1] || "",
      phone: patient.phone || "",
      doctorId,
      doctor: doctor.name,               // store name for convenience
      department: doctor.department || "",
      date: String(date),
      time: String(time),
      reason,
      notes,
      status: "Pending",
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("❌ bookAppointment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
