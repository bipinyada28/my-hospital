import React, { useEffect, useMemo, useState } from 'react';
import {
  Users, UserPlus, CalendarClock, FileText, Shield, Settings,
  Search, Trash2, Edit, Filter, Plus, X, Check, Upload
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line
} from "recharts";

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api/admin';

// --- Chart 1: Appointments by Status (Pie) ---
const AppointmentsPieChart = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-gray-500">No data</p>;
  const COLORS = ["#38bdf8", "#34d399", "#fbbf24", "#f87171"];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// --- Chart 2: Patients per Month (Line) ---
const PatientsLineChart = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-gray-500">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="patients" stroke="#6366f1" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// --- Chart 3: Appointments by Status (Bar) ---
const AppointmentsBarChart = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-gray-500">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // data
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);

  // UI state
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userQuery, setUserQuery] = useState('');

  const [apptStatusFilter, setApptStatusFilter] = useState('all');
  const [apptDoctorFilter, setApptDoctorFilter] = useState('all');
  const [apptDateFilter, setApptDateFilter] = useState('all');

  // Modals
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showUploadReport, setShowUploadReport] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // Temp form state
  const [doctorForm, setDoctorForm] = useState({ name: '', email: '', specialty: '' });
  const [patientForm, setPatientForm] = useState({ name: '', email: '', phone: '' });
  const [uploadForm, setUploadForm] = useState({ patientId: '', title: '', file: null, note: '' });

  // Handle custom modal
  const openModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowCustomModal(true);
  };
  const closeModal = () => {
    setShowCustomModal(false);
    setModalTitle('');
    setModalMessage('');
  };


  // -------- REAL load from APIs --------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login");
        return;
    }
    let isMounted = true;
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        const [metricsRes, usersRes, apptsRes, reportsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/metrics`, { headers }),
          axios.get(`${API_BASE_URL}/users`, { headers }),
          axios.get(`${API_BASE_URL}/appointments`, { headers }),
          axios.get(`${API_BASE_URL}/reports`, { headers }),
        ]);

        if (!isMounted) return;

        const normalizeData = (data) => Array.isArray(data) ? data.map(item => ({ ...item, id: item._id || item.id })) : [];

        setMetrics(metricsRes.data);
        setUsers(normalizeData(usersRes.data));
        setAppointments(normalizeData(apptsRes.data));
        setReports(normalizeData(reportsRes.data));
        
      } catch (err) {
        console.error('Failed to fetch admin data.', err.response || err.message);
        openModal('Error', 'Failed to fetch admin data.');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAll();
    return () => { isMounted = false; };
  }, [navigate]);
  
  // Chart Data Preparation (Client-side)
  const appointmentsByStatusChartData = useMemo(() => {
    const statusCounts = appointments.reduce((acc, appt) => {
      acc[appt.status] = (acc[appt.status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status],
    }));
  }, [appointments]);

  const patientsRegisteredByMonthChartData = useMemo(() => {
    const monthlyCounts = {};
    const today = new Date();
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyCounts[monthYear] = 0;
    }
    
    // Count patients by creation month
    users.filter(u => u.role === 'patient').forEach(p => {
      const d = new Date(p.createdAt);
      const monthYear = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyCounts.hasOwnProperty(monthYear)) {
        monthlyCounts[monthYear]++;
      }
    });

    return Object.keys(monthlyCounts).map(key => ({
      month: key,
      patients: monthlyCounts[key],
    }));
  }, [users]);


  // -------- Derived/UI helpers --------
  const cards = useMemo(() => ([
    { id: 'c1', icon: <Users size={22} />, label: 'Total Users', value: metrics?.totalUsers ?? '—' },
    { id: 'c2', icon: <Shield size={22} />, label: 'Active Doctors', value: metrics?.totalDoctors ?? '—' },
    { id: 'c3', icon: <CalendarClock size={22} />, label: 'Today’s Appointments', value: metrics?.todayAppointments ?? '—' },
    { id: 'c4', icon: <FileText size={22} />, label: 'Pending Reports', value: metrics?.pendingReports ?? '—' },
  ]), [metrics]);

  const statusBadge = (status) =>
    status === 'active' ? 'bg-emerald-100 text-emerald-700' :
      status === 'inactive' ? 'bg-slate-200 text-slate-700' :
        'bg-amber-100 text-amber-700';

  const apptBadge = (status) =>
    status === 'Confirmed' ? 'bg-sky-100 text-sky-700' :
      status === 'Pending' ? 'bg-amber-100 text-amber-700' :
        status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
          status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
            'bg-slate-100 text-slate-700';

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (userQuery && !(`${u.name} ${u.email}`.toLowerCase().includes(userQuery.toLowerCase()))) return false;
      return true;
    });
  }, [users, roleFilter, statusFilter, userQuery]);

  const doctorOptions = useMemo(
    () => users.filter(u => u.role === 'doctor' && u.status === 'active').map(d => ({ id: d.id, name: d.name })),
    [users]
  );
  
  const filteredAppointments = useMemo(() => {
    const today = todayISO();
    const tomorrow = addDaysISO(1);
    return appointments.filter(a => {
      if (apptStatusFilter !== 'all' && a.status !== apptStatusFilter) return false;
      if (apptDoctorFilter !== 'all' && a.doctor !== apptDoctorFilter) return false;
      if (apptDateFilter === 'today' && a.date !== today) return false;
      if (apptDateFilter === 'tomorrow' && a.date !== tomorrow) return false;
      return true;
    });
  }, [appointments, apptStatusFilter, apptDoctorFilter, apptDateFilter]);

  // -------- Handlers (wired to backend) --------
  const handleUserToggle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.patch(`${API_BASE_URL}/users/${id}/toggle`, null, { headers });
      const updated = res.data;
      setUsers(prev => prev.map(u => u.id === id ? ({ ...u, status: updated.status ?? (u.status === 'active' ? 'inactive' : 'active') }) : u));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Toggle failed');
    }
  };

  const handleUserDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${API_BASE_URL}/users/${id}`, { headers });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Delete failed');
    }
  };

  const handleReportApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.patch(`${API_BASE_URL}/reports/${id}/approve`, null, { headers });
      const updated = res.data;
      setReports(prev => prev.map(r => r.id === id ? ({ ...r, status: updated.status ?? 'Ready' }) : r));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Approve failed');
    }
  };

  const handleReportReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.patch(`${API_BASE_URL}/reports/${id}/reject`, null, { headers });
      const updated = res.data;
      setReports(prev => prev.map(r => r.id === id ? ({ ...r, status: updated.status ?? 'Rejected' }) : r));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Reject failed');
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const payload = {
      name: doctorForm.name,
      email: doctorForm.email,
      specialty: doctorForm.specialty,
      password: 'defaultPassword123',
      role: 'doctor',
    };
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_BASE_URL}/users`, payload, { headers });
      const created = res.data;
      setUsers(prev => [{ id: created.id ?? created._id ?? created.userId, ...created }, ...prev]);
      setDoctorForm({ name: '', email: '', specialty: '' });
      setShowAddDoctor(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Create doctor failed');
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const payload = {
      name: patientForm.name,
      email: patientForm.email,
      phone: patientForm.phone,
      password: 'defaultPassword123',
      role: 'patient',
    };
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_BASE_URL}/users`, payload, { headers });
      const created = res.data;
      setUsers(prev => [{ id: created.id ?? created._id ?? created.userId, ...created }, ...prev]);
      setPatientForm({ name: '', email: '', phone: '' });
      setShowAddPatient(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Create patient failed');
    }
  };

  const handleUploadReport = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      alert("Please select a file to upload.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("file", uploadForm.file);
      fd.append("title", uploadForm.title);
      fd.append("note", uploadForm.note);

      setIsLoading(true);

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_BASE_URL}/patients/${uploadForm.patientId}/reports`, fd, { headers });

      const data = res.data;
      setReports(prev => [data, ...prev]);

      alert("Report uploaded successfully!");

      setUploadForm({ patientId: '', title: '', file: null, note: '' });
      setShowUploadReport(false);
    } catch (err) {
      console.error(err);
      alert("Error uploading report");
    } finally {
      setIsLoading(false);
    }
  };

  const patientChoices = useMemo(
    () => users.filter(u => u.role === 'patient').map(p => ({ id: p.id, name: p.name })),
    [users]
  );

  // -------- UI --------
  return (
    <div className="min-h-screen bg-[#f8feff] text-slate-800 antialiased">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">System overview and management</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border">
            <div className="h-9 w-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">AD</div>
            <div>
              <p className="text-sm font-medium">Administrator</p>
              <p className="text-xs text-slate-400">admin@hospital.com</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-100 shadow-sm">
          {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {cards.map(c => (
              <div key={c.id} className="bg-gradient-to-br from-white/60 to-slate-50 rounded-xl p-4 border shadow-sm flex items-center gap-4">
                <div className="rounded-lg p-2 bg-white border">{c.icon}</div>
                <div>
                  <p className="text-xs text-slate-400">{c.label}</p>
                  <p className="font-semibold text-lg mt-1">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs (same look) */}
          <div className="grid grid-cols-5 w-full bg-sky-50 rounded-md overflow-hidden border border-slate-200 mb-5">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'users', label: 'Users' },
              { key: 'appointments', label: 'Appointments' },
              { key: 'reports', label: 'Reports' },
              { key: 'analytics', label: 'Analytics' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`py-2 text-sm font-medium transition ${tab === t.key ? 'bg-white text-sky-700 shadow' : 'text-slate-600 hover:bg-white/50'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="py-16 flex items-center justify-center text-slate-400">Loading admin view…</div>
          ) : (
            <>
              {/* -------- Overview -------- */}
              {tab === 'overview' && (
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Today’s Appointments */}
                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Today’s Appointments</h3>
                    <ul className="space-y-2 text-sm">
                      {appointments.filter(a => a.date === todayISO()).map(a => (
                        <li key={a.id} className="flex items-center justify-between bg-white border rounded-md p-2">
                          <div>
                            <p className="font-medium">{a.patient} → {a.doctor}</p>
                            <p className="text-xs text-slate-500">{a.time}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${apptBadge(a.status)}`}>{a.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pending Reports preview (read-only here) */}
                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Pending Reports</h3>
                    <ul className="space-y-2 text-sm">
                      {reports.filter(r => r.status === 'Pending').slice(0, 5).map(r => (
                        <li key={r.id} className="flex items-center justify-between bg-white border rounded-md p-2">
                          <div>
                            <p className="font-medium">{r.title}</p>
                            <p className="text-xs text-slate-500">{r.patient} • {formatDate(r.date)}</p>
                          </div>
                          <span className="text-xs text-amber-700">Pending</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Actions tailored */}
                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setShowAddDoctor(true)} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <UserPlus size={16} /> Add Doctor
                      </button>
                      <button onClick={() => setShowAddPatient(true)} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <Users size={16} /> Add Patient
                      </button>
                      <button onClick={() => setShowUploadReport(true)} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <Upload size={16} /> Upload Report
                      </button>
                      <button onClick={() => setTab('appointments')} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <CalendarClock size={16} /> Manage Slots
                      </button>
                    </div>
                  </div>

                  {/* Recent Users */}
                  <div className="md:col-span-3 mt-4">
                    <h4 className="text-sm font-semibold mb-3">Recent Users</h4>
                    <div className="space-y-2">
                      {users.slice(0, 5).map(u => (
                        <div key={u.id} className="bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email} • {u.role}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusBadge(u.status)}`}>{u.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* -------- Users -------- */}
              {tab === 'users' && (
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-2 bg-white border rounded-md px-3 py-2 w-full md:w-96">
                      <Search size={16} />
                      <input
                        className="outline-none text-sm w-full"
                        placeholder="Search users by name/email…"
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 border rounded-md px-2 py-1 bg-white">
                        <Filter size={16} />
                        <select className="text-sm outline-none" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                          <option value="all">All roles</option>
                          <option value="doctor">Doctors</option>
                          <option value="patient">Patients</option>
                          <option value="staff">Staff</option>
                        </select>
                        <select className="text-sm outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                          <option value="all">All status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <button onClick={() => setShowAddDoctor(true)} className="px-3 py-2 rounded-md bg-sky-500 text-white flex items-center gap-1">
                        <Plus size={16} /> Doctor
                      </button>
                      <button onClick={() => setShowAddPatient(true)} className="px-3 py-2 rounded-md bg-sky-500 text-white flex items-center gap-1">
                        <Plus size={16} /> Patient
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {filteredUsers.map(u => (
                      <div key={u.id} className="bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-medium">{u.name} {u.specialty ? <span className="text-xs text-slate-400">• {u.specialty}</span> : null}</p>
                          <p className="text-xs text-slate-400">{u.email} • {u.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusBadge(u.status)}`}>{u.status}</span>
                          <button className="text-xs text-sky-600 flex items-center gap-1" onClick={() => handleUserToggle(u.id)}>
                            <Edit size={14} /> Toggle
                          </button>
                          <button className="text-xs text-rose-600 flex items-center gap-1" onClick={() => handleUserDelete(u.id)}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="p-4 text-sm text-slate-500 bg-white rounded border">No users match the filters.</div>
                    )}
                  </div>
                </div>
              )}

              {/* -------- Appointments -------- */}
              {tab === 'appointments' && (
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold">Appointments</h3>
                    <div className="flex items-center gap-2">
                      <select className="text-sm border rounded-md px-2 py-1 bg-white" value={apptStatusFilter} onChange={(e) => setApptStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <select className="text-sm border rounded-md px-2 py-1 bg-white" value={apptDoctorFilter} onChange={(e) => setApptDoctorFilter(e.target.value)}>
                        <option value="all">All Doctors</option>
                        {doctorOptions.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                      <select className="text-sm border rounded-md px-2 py-1 bg-white" value={apptDateFilter} onChange={(e) => setApptDateFilter(e.target.value)}>
                        <option value="today">Today</option>
                        <option value="tomorrow">Tomorrow</option>
                        <option value="all">All Dates</option>
                      </select>
                      <button className="px-3 py-2 rounded-md border">Export</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {filteredAppointments.map(a => (
                      <div key={a.id} className="bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-medium">{a.patient} → {a.doctor}</p>
                          <p className="text-xs text-slate-400">{formatDate(a.date)} • {a.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${apptBadge(a.status)}`}>{a.status}</span>
                      </div>
                    ))}
                    {filteredAppointments.length === 0 && (
                      <div className="p-4 text-sm text-slate-500 bg-white rounded border">No appointments for selected filters.</div>
                    )}
                  </div>
                </div>
              )}

              {/* -------- Reports -------- */}
              {tab === 'reports' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Reports</h3>
                    <button onClick={() => setShowUploadReport(true)} className="px-3 py-2 rounded-md bg-sky-500 text-white flex items-center gap-1">
                      <Upload size={16} /> Upload Report
                    </button>
                  </div>
                  <div className="space-y-2">
                    {reports.map(r => (
                      <div key={r.id} className="bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-medium">{r.title}</p>
                          <p className="text-xs text-slate-400">{r.patient} • {formatDate(r.date)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            r.status === 'Pending' ? 'bg-amber-100 text-amber-700'
                              : r.status === 'Ready' ? 'bg-emerald-100 text-emerald-700'
                                : r.status === 'Rejected' ? 'bg-rose-100 text-rose-700'
                                  : 'bg-slate-100 text-slate-700'
                            }`}>{r.status}</span>
                          {r.status === 'Pending' && (
                            <>
                              <button className="text-xs text-emerald-700 flex items-center gap-1" onClick={() => handleReportApprove(r.id)}>
                                <Check size={14} /> Approve
                              </button>
                              <button className="text-xs text-rose-700 flex items-center gap-1" onClick={() => handleReportReject(r.id)}>
                                <X size={14} /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {reports.length === 0 && (
                      <div className="p-4 text-sm text-slate-500 bg-white rounded border">No reports found.</div>
                    )}
                  </div>
                </div>
              )}

              {/* -------- Analytics -------- */}
              {tab === 'analytics' && (
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm font-semibold mb-5">Analytics Dashboard</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* 1. Appointments by Status (Pie) */}
                    <div className="border rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold mb-3">Appointments Breakdown</h4>
                      <AppointmentsPieChart data={appointmentsByStatusChartData} />
                    </div>

                    {/* 2. Patients per Month (Line) */}
                    <div className="border rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold mb-3">Patients Registered per Month</h4>
                      <PatientsLineChart data={patientsRegisteredByMonthChartData} />
                    </div>

                    {/* 3. User Roles Distribution (Pie) */}
                    <div className="border rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold mb-3">User Roles Distribution</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Doctors", value: users.filter(u => u.role === "doctor").length },
                              { name: "Patients", value: users.filter(u => u.role === "patient").length },
                              { name: "Staff", value: users.filter(u => u.role === "staff").length },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label
                          >
                            <Cell fill="#38bdf8" />
                            <Cell fill="#34d399" />
                            <Cell fill="#fbbf24" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* 4. Appointments by Status (Bar) */}
                    <div className="border rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold mb-3">Appointments by Status</h4>
                      <AppointmentsBarChart
                        data={[
                          { name: "Confirmed", count: appointments.filter(a => a.status === "Confirmed").length },
                          { name: "Pending", count: appointments.filter(a => a.status === "Pending").length },
                          { name: "Completed", count: appointments.filter(a => a.status === "Completed").length },
                          { name: "Cancelled", count: appointments.filter(a => a.status === "Cancelled").length },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showAddDoctor && (
        <Modal title="Add Doctor" onClose={() => setShowAddDoctor(false)}>
          <form onSubmit={handleAddDoctor} className="space-y-3">
            <Input label="Full Name" value={doctorForm.name} onChange={(v) => setDoctorForm(s => ({ ...s, name: v }))} />
            <Input label="Email" value={doctorForm.email} onChange={(v) => setDoctorForm(s => ({ ...s, email: v }))} />
            <Input label="Specialty" value={doctorForm.specialty} onChange={(v) => setDoctorForm(s => ({ ...s, specialty: v }))} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddDoctor(false)} className="px-3 py-2 rounded-md border">Cancel</button>
              <button type="submit" className="px-3 py-2 rounded-md bg-sky-500 text-white">Add Doctor</button>
            </div>
          </form>
        </Modal>
      )}

      {showAddPatient && (
        <Modal title="Add Patient" onClose={() => setShowAddPatient(false)}>
          <form onSubmit={handleAddPatient} className="space-y-3">
            <Input label="Full Name" value={patientForm.name} onChange={(v) => setPatientForm(s => ({ ...s, name: v }))} />
            <Input label="Email" value={patientForm.email} onChange={(v) => setPatientForm(s => ({ ...s, email: v }))} />
            <Input label="Phone" value={patientForm.phone} onChange={(v) => setPatientForm(s => ({ ...s, phone: v }))} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddPatient(false)} className="px-3 py-2 rounded-md border">Cancel</button>
              <button type="submit" className="px-3 py-2 rounded-md bg-sky-500 text-white">Add Patient</button>
            </div>
          </form>
        </Modal>
      )}

      {showUploadReport && (
        <Modal title="Upload Report (assign to one patient)" onClose={() => setShowUploadReport(false)}>
          <form onSubmit={handleUploadReport} className="space-y-3">
            <div className="text-sm">
              <label className="block text-slate-600 mb-1">Patient</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={uploadForm.patientId}
                onChange={(e) => setUploadForm(s => ({ ...s, patientId: e.target.value }))}
                required
              >
                <option value="">Select Patient</option>
                {patientChoices.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <Input label="Report Title" value={uploadForm.title} onChange={(v) => setUploadForm(s => ({ ...s, title: v }))} />
            <div className="text-sm">
              <FileUploadInput
                label="File"
                file={uploadForm.file}
                onFileChange={(file) => setUploadForm(s => ({ ...s, file }))}
                required
              />
            </div>
            <div className="text-sm">
              <label className="block text-slate-600 mb-1">Doctor Note (optional)</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={uploadForm.note}
                onChange={(e) => setUploadForm(s => ({ ...s, note: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowUploadReport(false)} className="px-3 py-2 rounded-md border">Cancel</button>
              <button type="submit" className="px-3 py-2 rounded-md bg-sky-500 text-white">Upload</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function FileUploadInput({ label, file, onFileChange, required = false }) {
  return (
    <div className="text-sm">
      <label className="block text-slate-600 mb-1">{label}</label>
      <input
        type="file"
        className="w-full border rounded px-3 py-2 cursor-pointer"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        required={required}
      />
      {file && (
        <p className="mt-1 text-xs text-gray-500">Selected File: {file.name}</p>
      )}
    </div>
  );
}


/* ---------- Small UI helpers ---------- */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl border shadow-lg w-full max-w-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold">{title}</h4>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <div className="text-sm">
      <label className="block text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

/* ---------- Date helpers ---------- */
function todayISO() {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString().slice(0, 10);
}
function addDaysISO(n) {
  const d = new Date(); d.setDate(d.getDate() + n); d.setHours(0, 0, 0, 0); return d.toISOString().slice(0, 10);
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}