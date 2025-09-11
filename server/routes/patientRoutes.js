// server\routes\patientRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/roleMiddleware.js";
import {
  getProfile,
  updateProfile,
  getAppointments,
  cancelAppointment,
  getReports,
  downloadReport,
  bookAppointment,
} from "../controllers/patientController.js";

const router = express.Router();

// ✅ Protect all patient routes
router.use(authMiddleware, requireRole("patient"));

// Profile
router.get("/me", getProfile);
router.patch("/me", updateProfile);

// Appointments
router.get("/me/appointments", getAppointments);
router.post("/appointments", bookAppointment);
router.delete("/appointments/:id", cancelAppointment);

// Reports
router.get("/me/reports", getReports);
router.get("/reports/:id/download", downloadReport);

export default router;