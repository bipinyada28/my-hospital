// server/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Must be before routes

// Routes
app.use("/api", authRoutes);

// DB + Server
mongoose.connect(process.env.MONGO_URI, { dbName: "trueHeal" })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`✅ Server running on port ${process.env.PORT}`)
    );
    console.log("✅ MongoDB connected");
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));
