// server/routes/adminRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js"; // ✅ Multer middleware

import {
  getMetrics,
  getUsers,
  createUser,
  toggleUserStatus,
  deleteUser,
  getAppointments,
  updateAppointmentStatus,
  getReports,
  uploadReport,
  approveReport,
  rejectReport,
} from "../controllers/adminController.js";

const router = express.Router();

// ✅ Protect all admin routes: must be authenticated + admin role
router.use(authMiddleware, requireRole("admin"));

// 📊 Metrics summary endpoint
router.get("/metrics", getMetrics);

// 👤 Users CRUD endpoints
router.get("/users", getUsers);
router.post("/users", createUser);
router.patch("/users/:id/toggle", toggleUserStatus);
router.delete("/users/:id", deleteUser);

// 📅 Appointments management endpoints
router.get("/appointments", getAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);

// 📑 Reports management endpoints
router.get("/reports", getReports);

// ✅ Report upload route with Multer middleware
// `file` must match the field name in your form-data (frontend / Postman)
router.post(
  "/patients/:patientId/reports",
  upload.single("file"),
  uploadReport
);

router.patch("/reports/:id/approve", approveReport);
router.patch("/reports/:id/reject", rejectReport);

export default router;
