import Appointment from '../models/Appointment.js';
import nodemailer from 'nodemailer';
import mongoose from "mongoose";

// A helper function to normalize the output
const normalizeDoc = (doc) => {
  if (!doc) return null;
  const transformed = doc.toObject ? doc.toObject() : doc;
  transformed.id = transformed._id || transformed.id;
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

export const createAppointment = async (req, res) => {
  try {
    console.log("📥 Received Appointment:", req.body);

    // If logged in, authMiddleware will set req.userId
    const appointmentData = {
      ...req.body,
      userEmail: req.body.email, 
      userId: req.userId || null, // ✅ link logged-in patient if available
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // ✅ Send email
    const { email, firstName, doctor, date, time } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"True Heal Hospital" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Appointment Confirmation',
      html: `
        <h2>Hi ${firstName},</h2>
        <p>Your appointment has been successfully booked.</p>
        <p><strong>Doctor:</strong> ${doctor}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <br/>
        <p>Thank you for choosing <strong>True Heal Hospital</strong>.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Appointment booked successfully!' });

  } catch (error) {
    console.error("❌ Error saving appointment:", error);
    res.status(500).json({ message: 'Failed to book appointment!' });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.userId; // comes from authMiddleware
    const now = new Date();

    // find appointments for logged-in user
    const appointments = await Appointment.find({ userId }).sort({ date: 1 });

    const past = appointments.filter(a => new Date(a.date) < now);
    const current = appointments.filter(a => new Date(a.date).toDateString() === now.toDateString());
    const upcoming = appointments.filter(a => new Date(a.date) > now);

    res.json({ past, current, upcoming });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

export const changeAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.status = req.body.status || 'Completed';
    await appointment.save();
    res.json(normalizeDoc(appointment));
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Failed to update appointment status" });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    appointment.date = date;
    appointment.time = time;
    appointment.status = 'Rescheduled';
    await appointment.save();
    res.json(normalizeDoc(appointment));
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ message: "Failed to reschedule appointment" });
  }
};
