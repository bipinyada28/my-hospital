// server\controllers\dashboardController.js
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Report from "../models/Report.js";

export const getDashboardData = async (req, res) => {
  try {
    const { role, userId } = req;

    if (role === "patient") {
      const appointments = await Appointment.find({ userId })
        .populate("doctorId", "name specialty")
        .sort({ date: 1 });
      return res.json({ role, appointments });
    }

    if (role === "doctor") {
      const appointments = await Appointment.find({ doctorId: userId })
        .populate("userId", "name email")
        .sort({ date: 1 });
      return res.json({ role, appointments });
    }

    if (role === "admin") {
      const users = await User.find().select("-password").lean();
      const appointments = await Appointment.find()
        .populate("userId", "name email")
        .populate("doctorId", "name specialty")
        .sort({ date: 1 })
        .lean();

      const reports = await Report.find()
        .populate("patientId", "name email")
        .populate("doctorId", "name")
        .sort({ createdAt: -1 })
        .lean();

      // --- FIXED: Property name mismatch for total doctors ---
      const totalDoctors = users.filter(u => u.role === 'doctor').length;
      const totalAppointments = appointments.length;
      const pendingReports = reports.filter(r => r.status === 'Pending').length;
      const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().slice(0, 10)).length;

      return res.json({
        role,
        users,
        appointments,
        reports,
        stats: {
          totalUsers: users.length,
          totalDoctors, // Use the variable
          todayAppointments,
          pendingReports,
        }
      });
    }

    return res.status(403).json({ message: "Invalid role" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching dashboard data" });
  }
};