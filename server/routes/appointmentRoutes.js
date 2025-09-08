// server/routes/appointmentRoutes.js
import express from 'express';
import { createAppointment, getMyAppointments } from '../controllers/appointmentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createAppointment); 
router.get('/my-appointments', authMiddleware, getMyAppointments); // ✅ patient dashboard

export default router;
