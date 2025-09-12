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
    const patientAppointments = data.appointments?.map(app => ({
      ...app,
      doctor: app.doctorId?.name,
      department: app.doctorId?.specialty, // Corrected to use specialty
    })) || [];
    
    const patientReports = data.reports?.map(report => ({
        ...report,
        doctor: report.doctorId?.name,
    })) || [];

    // Correctly render components based on the role
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
        // You need to retrieve doctor-specific data here.
        // Your backend `getDashboardData` for doctors only returns appointments.
        // To make `DoctorDashboard` work as expected, you need to either:
        // 1. Fetch reports and patients here as well, or
        // 2. Adjust the `drController` to return all required data.
        // Based on your backend, let's assume you've updated `getDashboardData`
        // or will create dedicated endpoints for reports/patients.
        return <DoctorDashboard 
            profile={data.profile} 
            appointments={data.appointments} 
            reports={data.reports} // Assuming reports are now returned
            patients={data.patients} // Assuming patients are now returned
        />;
    }
    if (role === "admin") {
        return (
            <AdminDashboard
                profile={data.profile}
                metrics={data.stats}
                users={data.users}
                appointments={data.appointments}
                reports={data.reports}
            />
        );
    }

    return <p className="text-center mt-10 text-red-500">Invalid role</p>;
}