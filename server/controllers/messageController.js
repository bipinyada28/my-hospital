import Message from '../models/Message.js';
import nodemailer from 'nodemailer';

export const createMessage = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    const newMessage = new Message({ name, phone, email, subject, message });
    await newMessage.save();

    // ✅ Setup Gmail transporter (reused from appointments)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Prepare email content
    const mailOptions = {
      from: `"True Heal Hospital" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Message Received – True Heal Hospital',
      html: `
        <h2>Hi ${name},</h2>
        <p>We have received your message. Our team will get back to you shortly.</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <p><strong>Your Message:</strong> ${message}</p>
        <br/>
        <p>Thanks for contacting <strong>True Heal Hospital</strong>.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.error("❌ Error saving/sending message:", error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve messages' });
  }
};
