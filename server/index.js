import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import appointmentRoutes from './routes/appointmentRoutes.js';

dotenv.config();

const app = express(); // ✅ This is what you forgot
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // To parse JSON requests
app.use(cors()); 
// Routes
app.use('/api/appointments', appointmentRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
