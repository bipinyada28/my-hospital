// server/routes/appointmentRoutes.js
import express from 'express';
import { createAppointment } from '../controllers/appointmentController.js';
const router = express.Router();

router.post('/', createAppointment);

export default router;
