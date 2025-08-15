import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import AdminDashboard from "./AdminDashboard";
import { useNavigate } from "react-router-dom"; // ✅ add this

export default function Dashboard() {
  const navigate = useNavigate(); // ✅ add this
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // ✅ redirect if not logged in
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(res.data.role);
        setData(res.data);
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
        localStorage.removeItem("token"); // clear invalid token
        navigate("/login"); // redirect if token is bad
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!data || !role) {
    return (
      <p className="text-center mt-10 text-red-500">
        You must be logged in to view this page.
      </p>
    );
  }

  if (role === "patient") return <PatientDashboard appointments={data.appointments} />;
  if (role === "doctor") return <DoctorDashboard appointments={data.appointments} />;
  if (role === "admin") return <AdminDashboard stats={data.stats} />;

  return <p className="text-center mt-10 text-red-500">Invalid role</p>;
}
