// server/routes/publicRoutes.js

import express from "express";
import { getDoctors, getDepartments } from "../controllers/publicController.js"; // Import both functions

const router = express.Router();

router.get("/doctors", getDoctors);
router.get("/departments", getDepartments); // ✅ New route for departments

export default router;