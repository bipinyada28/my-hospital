// server/routes/adminRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/roleMiddleware.js";
import { listUsers, createUser, toggleUser, deleteUser } from "../controllers/adminUserController.js";

const router = express.Router();

// Users management (admin only)
router.get("/users", authMiddleware, requireRole("admin"), listUsers);
router.post("/users", authMiddleware, requireRole("admin"), createUser);
router.patch("/users/:id/toggle", authMiddleware, requireRole("admin"), toggleUser);
router.delete("/users/:id", authMiddleware, requireRole("admin"), deleteUser);

export default router;
