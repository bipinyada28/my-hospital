// server/seed/seedDepartments.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Department from "../models/Department.js";

dotenv.config({ path: '../.env' }); // Adjust path if .env is not in the same directory as seed script

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "test" });
    console.log("MongoDB connected for seeding...");

    await Department.deleteMany({});
    console.log("Existing departments cleared.");

    const departmentsToSeed = [
      {
        name: "Cardiology",
        description: "Advanced cardiac procedures, preventive care, and emergency interventions with state-of-the-art equipment.",
        patients: "120+",
        specialists: 3,
        timing: "24/7 Emergency",
        icon: "FaHeartbeat",
        color: "#FF588B", // Ensure this matches your colorClassMap keys
        // Removed 'rating' field
      },
      {
        name: "Neurology",
        description: "Comprehensive neurological care including stroke treatment, epilepsy management, and cognitive disorders.",
        patients: "80+",
        specialists: 2,
        timing: "Mon–Fri 8AM–6PM",
        icon: "FaBrain",
        color: "#8B5CF6",
        // Removed 'rating' field
      },
      {
        name: "Pediatrics",
        description: "Child-friendly environment with specialized pediatric treatments from newborn to adolescent care.",
        patients: "150+",
        specialists: 2,
        timing: "24/7 Emergency",
        icon: "FaBaby",
        color: "#3B82F6",
        // Removed 'rating' field
      },
      {
        name: "Ophthalmology",
        description: "Complete eye examinations, corrective surgery, and treatment for various ocular conditions.",
        patients: "90+",
        specialists: 1,
        timing: "Mon–Sat 9AM–5PM",
        icon: "FaEye",
        color: "#10B981",
        // Removed 'rating' field
      },
      {
        name: "Orthopedics",
        description: "Sports medicine, joint replacement, fracture care, and musculoskeletal rehabilitation.",
        patients: "110+",
        specialists: 2,
        timing: "Mon–Fri 7AM–7PM",
        icon: "FaBone",
        color: "#F97316",
        // Removed 'rating' field
      },
      {
        name: "Emergency Medicine",
        description: "Round-the-clock emergency care with trauma specialists and advanced life support systems.",
        patients: "500+",
        specialists: 4,
        timing: "24/7 Always Open",
        icon: "FaAmbulance",
        color: "#EF4444",
        // Removed 'rating' field
      },
      {
        name: "Internal Medicine",
        description: "Comprehensive primary care, preventive medicine, and management of chronic diseases for adults.",
        patients: "100+",
        specialists: 2,
        timing: "Mon–Sat 9AM–6PM",
        icon: "FaStethoscope",
        color: "#6366F1",
        // Removed 'rating' field
      },
      {
        name: "Preventive Care",
        description: "Health screenings, vaccination services, and wellness programs for a healthier community.",
        patients: "70+",
        specialists: 1,
        timing: "By Appointment",
        icon: "FaShieldAlt",
        color: "#059669",
        // Removed 'rating' field
      },
    ];

    await Department.insertMany(departmentsToSeed);
    console.log(`✅ ${departmentsToSeed.length} Departments seeded successfully`);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding departments:", error);
    process.exit(1);
  }
};

seed();