import Appointment from '../models/Appointment.js';
import nodemailer from 'nodemailer';
import User from "../models/User.js";
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

    const { doctor, department, email, firstName, date, time } = req.body;

    // ✅ find doctor by name (or email if you want stricter match)
    const doctorUser = await User.findOne({
      role: "doctor",
      name: doctor.replace(/^Dr\.\s*/, ""), // remove "Dr." if present
      department,
    });

    const appointmentData = {
      ...req.body,
      userEmail: email,
      userId: req.userId || null,
      doctorId: doctorUser ? doctorUser._id : null, // ✅ link doctor
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // ✅ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"True Heal Hospital" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Appointment Confirmation",
      html: `
        <h2>Hi ${firstName},</h2>
        <p>Your appointment has been successfully booked.</p>
        <p><strong>Doctor:</strong> ${doctor}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <br/>
        <p>Thank you for choosing <strong>True Heal Hospital</strong>.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Appointment booked successfully!" });
  } catch (error) {
    console.error("❌ Error saving appointment:", error);
    res.status(500).json({ message: "Failed to book appointment!" });
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
