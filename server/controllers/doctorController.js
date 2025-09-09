export const getDoctors = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = { role: "doctor" };

    if (department && department !== "All") {
      query.department = department;
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const doctors = await User.find(query);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};
