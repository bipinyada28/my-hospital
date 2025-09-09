import express from "express";
import { createDoctor, getDoctors } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", getDoctors);
router.post("/", createDoctor);

export default router;
