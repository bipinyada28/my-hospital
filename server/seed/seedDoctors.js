// server/seed/seedDoctors.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: "../.env" });

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "test" });
    console.log("MongoDB connected for seeding doctors...");

    // Remove only doctors (keep patients/admins)
    await User.deleteMany({ role: "doctor" });
    console.log("Existing doctors cleared.");

    const doctors = [
      {
        name: "Raj Patel",
        email: "raj.patel@example.com",
        password: "password123",
        role: "doctor",
        department: "Cardiology",
        specialty: "Cardiology",
        experience: 12,
        bio: "Expert in heart surgery and preventive cardiology.",
        timing: "Mon–Fri 9AM–5PM",
        patients: "2,500+",
        specializations: ["Heart Surgery", "Preventive Cardiology"],
        photoUrl: "https://images.unsplash.com/photo-1712215544003-af10130f8eb3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM0fHx8ZW58MHx8fHx8",
      },
      {
        name: "Meera Nair",
        email: "meera.nair@example.com",
        password: "$2b$10$L.skeqf6BnX7ZV45pUP1E.wRk.4aqpma.uWlS1KqG5TAjZYKUdp2W",
        role: "doctor",
        department: "Neurology",
        specialty: "Neurology",
        experience: 10,
        bio: "Specialist in stroke treatment and epilepsy management.",
        timing: "Mon–Fri 9AM–6PM",
        patients: "1,800+",
        specializations: ["Stroke Treatment", "Epilepsy"],
        photoUrl: "https://cdn.pixabay.com/photo/2017/01/29/21/16/nurse-2019420_1280.jpg",
      },
      {
        name: "Emily Rodriguez",
        email: "emily.rodriguez@example.com",
        password: "password123",
        role: "doctor",
        department: "Pediatrics",
        specialty: "Pediatrics",
        experience: 8,
        bio: "Pediatrician providing comprehensive care for children.",
        timing: "Mon–Sat 8AM–4PM",
        patients: "3,200+",
        specializations: ["Newborn Care", "Child Development"],
        photoUrl: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "David Thompson",
        email: "david.thompson@example.com",
        password: "password123",
        role: "doctor",
        department: "Orthopedics",
        specialty: "Orthopedics",
        experience: 15,
        bio: "Orthopedic surgeon specializing in joint replacement.",
        timing: "Mon–Fri 7AM–7PM",
        patients: "2,000+",
        specializations: ["Joint Replacement", "Sports Medicine"],
        photoUrl: "https://randomuser.me/api/portraits/men/44.jpg",
      },
      {
        name: "Lisa Park",
        email: "lisa.park@example.com",
        password: "password123",
        role: "doctor",
        department: "Ophthalmology",
        specialty: "Ophthalmology",
        experience: 14,
        bio: "Expert in vision correction and eye surgeries.",
        timing: "Mon–Sat 9AM–5PM",
        patients: "1,200+",
        specializations: ["Cataract Surgery", "LASIK"],
        photoUrl: "https://plus.unsplash.com/premium_photo-1675807264002-74250202f195?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        password: "password123",
        role: "doctor",
        department: "Emergency Medicine",
        specialty: "Emergency Medicine",
        experience: 16,
        bio: "Leads the emergency department with critical care expertise.",
        timing: "24/7 Emergency",
        patients: "15,000+",
        specializations: ["Trauma Care", "Critical Care"],
        photoUrl: "https://randomuser.me/api/portraits/men/66.jpg",
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        password: "$2b$10$L.skeqf6BnX7ZV45pUP1E.wRk.4aqpma.uWlS1KqG5TAjZYKUdp2W",
        role: "doctor",
        department: "Internal Medicine",
        specialty: "Internal Medicine",
        experience: 9,
        bio: "Internal medicine expert managing chronic illnesses.",
        timing: "Mon–Sat 9AM–6PM",
        patients: "2,500+",
        specializations: ["Diabetes Management", "Preventive Medicine"],
        photoUrl: "https://images.unsplash.com/photo-1659353885472-85256e76dd28?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "Arjun Desai",
        email: "arjun.desai@example.com",
        password: "password123",
        role: "doctor",
        department: "Preventive Care",
        specialty: "Preventive Care",
        experience: 7,
        bio: "Specialist in health screenings and vaccination programs.",
        timing: "By Appointment",
        patients: "1,500+",
        specializations: ["Health Screenings", "Vaccinations"],
        photoUrl: "https://randomuser.me/api/portraits/men/88.jpg",
      },
    ];

    await User.insertMany(doctors);
    console.log(`✅ ${doctors.length} doctors seeded successfully!`);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding doctors:", error);
    process.exit(1);
  }
};

seedDoctors();
