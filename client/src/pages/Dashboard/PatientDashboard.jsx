import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Sidebar from "./Sidebar";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  // ---- Render Tab Content ----
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div data-aos="fade-up" className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold text-primary mb-4">Welcome Back 👋</h2>
            <p className="text-gray-700">
              Here’s a quick look at your recent activities and health updates.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-100 p-4 rounded shadow">
                <h4 className="font-semibold text-blue-600">Upcoming Appointments</h4>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="bg-green-100 p-4 rounded shadow">
                <h4 className="font-semibold text-green-600">Medical Records</h4>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded shadow">
                <h4 className="font-semibold text-yellow-600">Prescriptions</h4>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
        );

      case "appointments":
        return (
          <div data-aos="fade-up" className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold text-primary mb-4">My Appointments 📅</h2>
            <table className="w-full border text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Doctor</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border">2025-08-15</td>
                  <td className="p-2 border">Dr. Smith</td>
                  <td className="p-2 border text-green-600 font-semibold">Confirmed</td>
                </tr>
                <tr>
                  <td className="p-2 border">2025-08-20</td>
                  <td className="p-2 border">Dr. Patel</td>
                  <td className="p-2 border text-yellow-600 font-semibold">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "records":
        return (
          <div data-aos="fade-up" className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold text-primary mb-4">Medical Records 📂</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-100 rounded shadow">Blood Test - Jan 2025</li>
              <li className="p-3 bg-gray-100 rounded shadow">X-Ray - Mar 2025</li>
              <li className="p-3 bg-gray-100 rounded shadow">MRI Scan - Apr 2025</li>
            </ul>
          </div>
        );

      case "profile":
        return (
          <div data-aos="fade-up" className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold text-primary mb-4">Update Profile ✏️</h2>
            <form className="space-y-4 max-w-lg">
              <input
                type="text"
                placeholder="Full Name"
                className="border p-2 w-full rounded"
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 w-full rounded"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="border p-2 w-full rounded"
              />
              <textarea
                placeholder="Address"
                className="border p-2 w-full rounded"
                rows={3}
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Save Changes
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default PatientDashboard;
