// server/routes/dashboardRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", authMiddleware, getDashboardData);

export default router;
