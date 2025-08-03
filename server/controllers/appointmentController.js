import Appointment from '../models/Appointment.js';
import nodemailer from 'nodemailer';

export const createAppointment = async (req, res) => {
  try {
    console.log("📥 Received Appointment:", req.body);

    const appointmentData = {
      ...req.body,
      userEmail: req.body.email, // map 'email' to 'userEmail'
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save(); // ✅ Save first

    // ✅ Extract values for email
    const { email, firstName, doctor, date, time } = req.body;

    // ✅ Setup Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Must be an App Password, not Gmail login
      },
    });

    // ✅ Email content
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

    // ✅ Send the confirmation email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Appointment booked successfully!' });

  } catch (error) {
    console.error("❌ Error saving appointment:", error);
    res.status(500).json({ message: 'Failed to book appointment!' });
  }
};
