// server/controllers/dashboardController.js
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

export const getDashboardData = async (req, res) => {
  try {
    const { userId, role } = req;

    if (role === "patient") {
      // Patient: show upcoming appointments
      const appointments = await Appointment.find({ patientId: userId })
        .populate("doctorId", "name specialty")
        .sort({ date: 1 });
      return res.json({ role, appointments });
    }

    if (role === "doctor") {
      // Doctor: show their patients
      const appointments = await Appointment.find({ doctorId: userId })
        .populate("patientId", "name email")
        .sort({ date: 1 });
      return res.json({ role, appointments });
    }

    if (role === "admin") {
      // Admin: system stats
      const totalUsers = await User.countDocuments();
      const totalDoctors = await Doctor.countDocuments();
      const totalAppointments = await Appointment.countDocuments();
      return res.json({
        role,
        stats: { totalUsers, totalDoctors, totalAppointments }
      });
    }

    res.status(403).json({ message: "Invalid role" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
