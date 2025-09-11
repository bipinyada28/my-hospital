import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";
import AdminDashboard from "./AdminDashboard";


export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const [data, setData] = useState(null);


    useEffect(() => {
        const fetchDashboard = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await axios.get("http://localhost:5000/api/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setRole(res.data.role);
                setData(res.data);
            } catch (error) {
                console.error("Dashboard fetch failed:", error.response || error.message || error);
                localStorage.removeItem("token");
                navigate("/login");
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
    
    // Transform data here before passing to components
    // This is a robust approach to keep child components "dumb"
    const patientAppointments = data.appointments?.map(app => ({
      ...app,
      doctor: app.doctorId?.name,
      department: app.doctorId?.department,
    })) || [];
    
    const patientReports = data.reports?.map(report => ({
        ...report,
        doctor: report.doctorId?.name,
    })) || [];

    // ✅ Pass profile everywhere
    if (role === "patient") {
        return (
            <PatientDashboard 
                profile={data.profile} 
                appointments={patientAppointments} 
                reports={patientReports}
            />
        );
    }
    if (role === "doctor") {
        return <DoctorDashboard profile={data.profile} appointments={data.appointments} />;
    }
    if (role === "admin") {
        return (
            <AdminDashboard
                profile={data.profile}
                stats={data.stats}
                users={data.users}
                appointments={data.appointments}
                reports={data.reports}
            />
        );
    }

    return <p className="text-center mt-10 text-red-500">Invalid role</p>;
}