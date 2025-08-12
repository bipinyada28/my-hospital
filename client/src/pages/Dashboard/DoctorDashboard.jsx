import React, { useState } from 'react';
import {
  FaCalendarDay,
  FaUserInjured,
  FaFileMedicalAlt,
  FaBell,
  FaArrowLeft,
  FaPlus,
  FaEye,
  FaPhoneAlt,
  FaEdit,
} from 'react-icons/fa';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { icon: <FaCalendarDay />, label: "Today's Appointments", value: '8' },
    { icon: <FaUserInjured />, label: 'Patients Under Care', value: '35' },
    { icon: <FaFileMedicalAlt />, label: 'Pending Reports', value: '5' },
    { icon: <FaBell />, label: 'Notifications', value: '3' },
  ];

  const appointments = [
    { patient: 'John Doe', time: '10:30 AM', status: 'confirmed' },
    { patient: 'Mary Smith', time: '11:00 AM', status: 'pending' },
  ];

  const patients = [
    { name: 'John Doe', age: 40, lastVisit: 'Feb 1, 2024' },
    { name: 'Mary Smith', age: 29, lastVisit: 'Jan 25, 2024' },
  ];

  const reports = [
    { title: 'Blood Test', patient: 'John Doe', date: 'Jan 28, 2024' },
    { title: 'X-Ray', patient: 'Mary Smith', date: 'Jan 15, 2024' },
  ];

  return (
    <div className="bg-blue-50 min-h-screen text-gray-800">
      {/* Header */}
      <header className="p-6 bg-white shadow-md flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <FaArrowLeft /> Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-blue-700">Doctor Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, Dr. Sarah Johnson • ID: DR1001</p>
          </div>
        </div>
        <span className="bg-green-100 text-green-700 px-4 py-1 text-sm rounded-full font-medium shadow-sm">
          On Duty
        </span>
      </header>

      {/* Stats */}
      <section className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="text-blue-600 text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Tabs */}
      <div className="px-6 mt-4">
        <div className="flex space-x-4 mb-6">
          {['overview', 'appointments', 'patients', 'reports', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Next Appointment */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-blue-700 mb-3">Next Appointment</h2>
              <p className="text-gray-700 font-medium">{appointments[0].patient}</p>
              <p className="text-sm text-gray-500">{appointments[0].time}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                {appointments[0].status}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-blue-700 mb-3">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex justify-center items-center gap-2">
                  <FaPlus /> Add Appointment
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition">
                  View Patients
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition">
                  Review Reports
                </button>
              </div>
            </div>

            {/* Reminders */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-blue-700 mb-3">Reminders</h2>
              <ul className="list-disc ml-4 text-sm text-gray-600">
                <li>Follow-up call with Mary Smith</li>
                <li>Update patient records</li>
                <li>Review new lab reports</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Today's Appointments</h2>
            {appointments.map((appt, i) => (
              <div key={i} className="border-b py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{appt.patient}</p>
                  <p className="text-sm text-gray-500">{appt.time}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Your Patients</h2>
            {patients.map((p, i) => (
              <div key={i} className="border-b py-3">
                <p className="font-medium">{p.name} <span className="text-sm text-gray-500">(Age {p.age})</span></p>
                <p className="text-sm text-gray-500">Last visit: {p.lastVisit}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Pending Reports</h2>
            {reports.map((r, i) => (
              <div key={i} className="flex justify-between items-center border-b py-3">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-gray-500">Patient: {r.patient} • {r.date}</p>
                </div>
                <button className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                  <FaEye /> Review
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-blue-700 mb-3">Doctor Info</h2>
              <p><strong>Name:</strong> Dr. Sarah Johnson</p>
              <p><strong>Email:</strong> sarah.johnson@hospital.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Specialization:</strong> Cardiology</p>
              <button className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1">
                <FaEdit /> Edit Profile
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-blue-700 mb-3">Contact</h2>
              <p><strong>Office:</strong> Room 201, Medical Building</p>
              <p><strong>Phone:</strong> +91 98765 43211</p>
              <button className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1">
                <FaPhoneAlt /> Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
