// server/controllers/publicController.js
import User from "../models/User.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("name department specialty experience bio timing patients specializations photoUrl");

    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};
