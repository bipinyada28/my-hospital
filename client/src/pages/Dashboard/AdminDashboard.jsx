import React, { useState } from 'react';
import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaFileAlt,
  FaCog,
  FaArrowLeft,
  FaPlus,
  FaEye,
  FaTrash,
  FaUserEdit,
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { icon: <FaUsers />, label: 'Total Patients', value: '1200' },
    { icon: <FaUserMd />, label: 'Total Doctors', value: '85' },
    { icon: <FaCalendarCheck />, label: 'Appointments Today', value: '34' },
    { icon: <FaFileAlt />, label: 'Total Reports', value: '5600' },
  ];

  const latestActivity = [
    { type: 'New Appointment', user: 'John Doe', time: '10:00 AM' },
    { type: 'Report Uploaded', user: 'Dr. Sarah J.', time: '9:45 AM' },
    { type: 'New Patient Registered', user: 'Alice Smith', time: '9:30 AM' },
  ];

  const users = [
    { name: 'Dr. Sarah Johnson', role: 'Doctor', status: 'Active' },
    { name: 'John Doe', role: 'Patient', status: 'Active' },
    { name: 'Jane Roe', role: 'Patient', status: 'Inactive' },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-4">
          <button className="text-blue-400 text-sm flex items-center gap-1">
            <FaArrowLeft /> Back
          </button>
          <FaCog className="text-blue-400 text-3xl" />
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, Admin • ID: ADMN-001</p>
          </div>
        </div>
        <button className="bg-blue-100 text-blue-600 text-sm px-4 py-1 rounded-full">
          Admin Access
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {stats.map((s, i) => (
          <div key={i} className="border rounded-lg p-4 text-center text-sm flex flex-col items-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-bold text-lg">{s.value}</div>
            <div className="text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex border rounded-lg overflow-hidden mb-4 text-sm">
          {['overview', 'manage users', 'appointments', 'reports', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 capitalize transition ${
                activeTab === tab ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded p-4 md:col-span-2">
              <h2 className="font-semibold mb-3">Recent Activity</h2>
              <ul className="text-sm">
                {latestActivity.map((a, i) => (
                  <li key={i} className="mb-2">
                    <span className="font-semibold">{a.type}</span> by {a.user} at {a.time}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border rounded p-4">
              <h2 className="font-semibold mb-3">Quick Actions</h2>
              <button className="block w-full bg-blue-300 text-white py-2 rounded mb-2 text-sm">
                Add New Doctor
              </button>
              <button className="block w-full bg-green-300 text-white py-2 rounded mb-2 text-sm">
                Add New Patient
              </button>
              <button className="block w-full border py-2 rounded mb-2 text-sm text-blue-500">
                Manage Appointments
              </button>
              <button className="block w-full border py-2 rounded text-sm text-blue-500">
                View Reports
              </button>
            </div>
          </div>
        )}

        {/* Manage Users */}
        {activeTab === 'manage users' && (
          <div className="border rounded p-4">
            <h2 className="font-semibold text-lg mb-3">User Management</h2>
            {users.map((u, i) => (
              <div key={i} className="flex justify-between items-center bg-blue-50 p-3 rounded mb-2 text-sm">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-gray-600">{u.role}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                    u.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {u.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-100 text-blue-500 px-3 py-1 rounded text-xs flex items-center gap-1">
                    <FaUserEdit /> Edit
                  </button>
                  <button className="bg-red-100 text-red-500 px-3 py-1 rounded text-xs flex items-center gap-1">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appointments */}
        {activeTab === 'appointments' && (
          <div className="border rounded p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Manage Appointments</h2>
              <button className="text-sm bg-blue-200 px-3 py-1 rounded text-white flex items-center gap-1">
                <FaPlus /> Add Appointment
              </button>
            </div>
            <p className="text-sm text-gray-600">Functionality to view/edit/cancel appointments here...</p>
          </div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <div className="border rounded p-4">
            <h2 className="font-semibold text-lg mb-3">Reports Management</h2>
            <p className="text-sm text-gray-600">List and control uploaded reports here...</p>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <h2 className="font-semibold mb-2">Admin Profile</h2>
              <p><strong>Name:</strong> Admin User</p>
              <p><strong>Email:</strong> admin@hospital.com</p>
              <p><strong>Phone:</strong> +91 99999 99999</p>
              <button className="mt-2 text-sm bg-blue-50 text-blue-500 px-3 py-1 rounded">
                Edit Profile
              </button>
            </div>
            <div className="border rounded p-4">
              <h2 className="font-semibold mb-2">System Settings</h2>
              <p className="text-sm">Manage system-wide settings, permissions, and backup options.</p>
              <button className="mt-2 text-sm bg-blue-50 text-blue-500 px-3 py-1 rounded">
                Open Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
