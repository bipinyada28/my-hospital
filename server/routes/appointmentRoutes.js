import express from 'express';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// POST - Book appointment
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, department, date, message } = req.body;

    const newAppointment = new Appointment({ name, phone, email, department, date, message });
    const saved = await newAppointment.save();

    res.status(201).json({ message: 'Appointment booked', appointment: saved });
  } catch (err) {
    res.status(500).json({ error: 'Error booking appointment', details: err.message });
  }
});

// (Optional) GET - List all appointments
router.get('/', async (req, res) => {
  try {
    const list = await Appointment.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch appointments' });
  }
});

export default router;
