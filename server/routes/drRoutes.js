// server\routes\drRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/roleMiddleware.js";
import {
  getDoctorDashboardData,
  updateDoctorProfile,
  updateAppointmentStatus,
  createReport,
} from "../controllers/drController.js";

const router = express.Router();

// ✅ Protect all doctor routes and ensure only doctors can access them
router.use(authMiddleware, requireRole("doctor"));

// Dashboard
router.get("/dashboard", getDoctorDashboardData);

// Profile
router.patch("/profile", updateDoctorProfile);

// Appointments
router.patch("/appointments/:id/status", updateAppointmentStatus);

// Reports
router.post("/reports", createReport);

export default router;