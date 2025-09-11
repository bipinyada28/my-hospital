// server/controllers/publicController.js

import User from "../models/User.js";
import Department from "../models/Department.js"; // Import Department model

// Function for the public Doctors page
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .populate("department", "name") // Populate the department name
      .select("name department specialty experience bio timing patients specializations photoUrl");
    // NOTE: The department field is an ObjectId. Populating it is a good practice.

    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

// Function for the public Departments page (or for fetching data on the client side)
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};