// server/controllers/adminUserController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// GET /api/admin/users
export async function listUsers(req, res) {
  try {
    const users = await User.find({}, "name email role verified createdAt")
                            .sort({ createdAt: -1 });
    // standardize status for frontend
    const data = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
    }));
    res.json(data);
  } catch (e) {
    console.error("listUsers error", e);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

// POST /api/admin/users
// body: { name, email, password, role, status }
export async function createUser(req, res) {
  try {
    const { name, email, password, role = "patient", status = "active", phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
    name,
    email,
    phone,
    password: hashed,
    role,
    verified: status === "active",
    status,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.verified ? "active" : "inactive",
    });
  } catch (e) {
    console.error("createUser error", e);
    res.status(500).json({ message: "Failed to create user" });
  }
}

// PATCH /api/admin/users/:id/toggle
export async function toggleUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    res.json({
    id: user._id,
    status: user.status,
    });
  } catch (e) {
    console.error("toggleUser error", e);
    res.status(500).json({ message: "Failed to toggle user" });
  }
}

// DELETE /api/admin/users/:id
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (e) {
    console.error("deleteUser error", e);
    res.status(500).json({ message: "Failed to delete user" });
  }
}
