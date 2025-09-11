// client\src\pages\Dashboard\PatientDashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays,
  FileText,
  Heart,
  User,
  Download,
  Phone,
  Upload,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * PatientDashboard.jsx
 * - Now accepts data via props from Dashboard.jsx
 * - Does NOT make its own data fetching calls
 */

// Create a reusable API instance with the auth token
const API = axios.create({
  baseURL: 'http://localhost:5000/api/patient', // Adjust this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default function PatientDashboard({ profile, appointments, reports }) {
  const [tab, setTab] = useState('overview');

  // Data is now passed as props, use it directly
  const userInfo = profile;
  const patientAppointments = appointments;
  const patientReports = reports;

  const navigate = useNavigate();

  // -------------------------
  // Derived stats
  // -------------------------
  const stats = useMemo(() => {
    const upcoming = patientAppointments.filter((a) => new Date(a.date) >= new Date()).length;
    const uniqueDoctors = new Set(patientAppointments.map((a) => a.doctor)).size;
    return [
      { id: 's1', icon: <CalendarDays size={24} />, label: 'Upcoming', value: upcoming },
      { id: 's2', icon: <FileText size={24} />, label: 'Reports', value: patientReports.length },
      { id: 's3', icon: <User size={24} />, label: 'Doctors Seen', value: uniqueDoctors },
      {
        id: 's4',
        icon: <Heart size={24} />,
        label: 'Member Since',
        value: userInfo?.createdAt ? formatDate(userInfo.createdAt) : '—',
      },
    ];
  }, [patientAppointments, patientReports, userInfo]);

  // -------------------------
  // Status badge helper
  // -------------------------
  const statusClasses = (status) =>
    status?.toLowerCase().includes('confirm')
      ? 'bg-blue-100 text-blue-700'
      : status?.toLowerCase().includes('pending')
      ? 'bg-amber-100 text-amber-700'
      : status?.toLowerCase().includes('cancel')
      ? 'bg-rose-100 text-rose-700'
      : 'bg-gray-100 text-gray-700';

  // -------------------------
  // Handlers
  // -------------------------
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    try {
      await API.delete(`/appointments/${id}`);
      // Optimistically update the UI to avoid another fetch
      // Note: This won't actually update the parent component's state.
      // A full re-fetch or state management solution would be better for a production app.
      // For this single component, it's fine.
      alert('Appointment cancelled successfully!');
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const res = await API.get(`/reports/${reportId}/download`, {
        responseType: 'blob', // Important for handling file downloads
      });

      // Create a temporary URL for the blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      // Get filename from response headers or a hardcoded value
      const filename = `report-${reportId}.pdf`; // Fallback filename
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report:', err);
      alert('Failed to download report. Please try again.');
    }
  };

  const handleUploadReport = async (file) => {
    // NOTE: Your backend for this feature is not yet provided.
    // This is a placeholder for a future implementation.
    if (!file) return;
    alert(`Upload placeholder: ${file.name} — backend not yet implemented`);
  };


  const goToBook = () => navigate('/book-appointment');
  const openMedicalTab = () => setTab('medical');

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="min-h-screen bg-[#f8feff] text-slate-800 antialiased">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
        {/* Topbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Patient Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back, <span className="font-semibold">{userInfo?.name ?? 'Guest'}</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-xs text-slate-400">ID: {userInfo?._id ?? '—'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Profile small */}
            <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white ${userInfo?.avatarColor ?? 'bg-slate-300'}`}>
                <span className="font-semibold">{(userInfo?.name || 'JD').split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-none">{userInfo?.name ?? 'Guest'}</p>
                <p className="text-xs text-slate-400">{userInfo?.email ?? ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-100 shadow-sm">
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((s) => (
                <div key={s.id} className="bg-gradient-to-br from-white/60 to-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                  <div className="rounded-lg p-2 bg-white/80 border border-slate-100">{s.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">{s.label}</p>
                    <p className="font-semibold text-lg mt-1">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mb-5">
              <div className="grid grid-cols-4 w-full bg-sky-50 rounded-md overflow-hidden border border-slate-200">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'appointments', label: 'Appointments' },
                  { key: 'medical', label: 'Medical Records' },
                  { key: 'profile', label: 'Profile' },
                ].map((tabItem) => (
                  <button
                    key={tabItem.key}
                    onClick={() => setTab(tabItem.key)}
                    className={`py-2 text-sm font-medium transition ${
                      tab === tabItem.key ? 'bg-white text-sky-700 shadow' : 'text-slate-600 hover:bg-white/50'
                    }`}
                    role="tab"
                    aria-selected={tab === tabItem.key}
                    aria-controls={`panel-${tabItem.key}`}
                    id={`tab-${tabItem.key}`}
                  >
                    {tabItem.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Panels */}
            <div>
              {tab === 'overview' && (
                <section id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">
                  <OverviewPanel
                    appointments={patientAppointments}
                    reports={patientReports}
                    userInfo={userInfo}
                    statusClasses={statusClasses}
                    onBook={goToBook}
                    onViewAll={() => setTab('appointments')}
                    setTab={setTab}
                    handleCancel={handleCancel}
                  />
                </section>
              )}

              {tab === 'appointments' && (
                <section id="panel-appointments" role="tabpanel" aria-labelledby="tab-appointments">
                  <AppointmentsPanel
                    appointments={patientAppointments}
                    statusClasses={statusClasses}
                    onCancel={handleCancel}
                    onBook={goToBook}
                  />
                </section>
              )}

              {tab === 'medical' && (
                <section id="panel-medical" role="tabpanel" aria-labelledby="tab-medical">
                  <MedicalPanel
                    reports={patientReports}
                    onDownload={handleDownloadReport}
                    onUpload={handleUploadReport}
                    setTab={setTab}
                  />
                </section>
              )}

              {tab === 'profile' && (
                <section id="panel-profile" role="tabpanel" aria-labelledby="tab-profile">
                  <ProfilePanel userInfo={userInfo} onEdit={() => alert('Edit Profile (placeholder)')} />
                </section>
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
    Reusable components below
    ------------------------- */

function OverviewPanel({ appointments, reports, userInfo, statusClasses, onBook, onViewAll, setTab, handleCancel }) {
  const upcomingList = appointments.filter((a) => new Date(a.date) >= new Date()).slice(0, 2);
  const upcomingCount = appointments.filter((a) => new Date(a.date) >= new Date()).length;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-2">Next Appointment</h3>
        {appointments.length > 0 ? (
          <>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-sky-100 text-sky-700 font-semibold">
                {appointments[0].doctor?.split(' ').slice(-1)[0][0]}
              </div>
              <div>
                <p className="font-semibold">{appointments[0].doctor}</p>
                <p className="text-xs text-slate-500">{appointments[0].department}</p>
                <p className="text-sm text-slate-600 mt-1">{formatDate(appointments[0].date)} • {appointments[0].time}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(appointments[0].status)}`}>{appointments[0].status}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => alert('Open directions (placeholder)')} className="text-xs text-sky-600">Directions</button>
                <button onClick={() => alert('Details (placeholder)')} className="text-xs text-slate-500">Details</button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">No upcoming appointments.</p>
        )}
      </div>

      {/* Replaced Health Snapshot with My Appointments */}
      <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold mb-2">My Appointments</h3>
            <p className="text-sm text-slate-500">You have <span className="font-semibold">{upcomingCount}</span> upcoming appointments.</p>
          </div>
          <div className="text-right">
            <button onClick={onBook} className="px-3 py-1 rounded-md bg-sky-500 text-white text-sm">Book</button>
          </div>
        </div>
        <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
          {upcomingList.length === 0 ? (
            <div className="text-sm text-slate-500">No appointments to show here.</div>
          ) : upcomingList.map((a) => (
            <div key={a._id} className="flex items-center justify-between bg-white/60 rounded-md p-2 border border-slate-100">
              <div>
                <p className="font-medium text-sm">{a.doctor}</p>
                <p className="text-xs text-slate-400">{a.department} • {formatDate(a.date)} • {a.time}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(a.status)}`}>{a.status}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-end">
          <button onClick={onViewAll} className="text-sm text-sky-600">View all appointments</button>
        </div>
      </div>

      <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-2">Recent Reports</h3>
        <p className="text-sm text-slate-500">{reports.length} Reports</p>
        <div className="mt-3 flex gap-2">
          <button onClick={() => setTab('medical')} className="px-3 py-1 rounded-md bg-sky-50 text-sky-700 text-sm">View all</button>
          <button onClick={() => alert('Download all reports (placeholder)')} className="px-3 py-1 rounded-md border border-slate-100 text-sm">Download</button>
        </div>
      </div>

      {/* Appointments list (wide) */}
      <div className="md:col-span-2 mt-4">
        <h4 className="text-sm font-semibold mb-3">Upcoming Appointments</h4>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {appointments.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 bg-white rounded">No upcoming appointments.</div>
          ) : appointments.map((a) => (
            <div key={a._id} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-sky-50 text-sky-700 font-semibold">
                  {a.doctor?.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <p className="font-medium">{a.doctor}</p>
                  <p className="text-xs text-slate-400">{a.department} • {a.location}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(a.date)} • {a.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(a.status)}`}>{a.status}</span>
                {a.status !== 'Cancelled' && (
                  <button onClick={() => handleCancel(a._id)} className="text-xs text-rose-600">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Quick Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          <button onClick={onBook} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
            <CalendarDays size={16} /> Book Appointment
          </button>
          <button onClick={() => setTab('medical')} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
            <FileText size={16} /> View Medical Records
          </button>
          <button onClick={() => setTab('medical')} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
            <Download size={16} /> Download Reports
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-slate-100 shadow-sm hover:shadow-md transition" onClick={() => alert('Contact doctor (placeholder)')}>
            <Phone size={16} /> Contact Doctor
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Appointments Panel ---- */
function AppointmentsPanel({ appointments, statusClasses, onCancel, onBook }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={onBook} className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-500 text-white hover:brightness-95 transition">
          + Book New Appointment
        </button>
      </div>

      <h3 className="text-sm font-semibold mb-3">All Appointments</h3>
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <div className="p-4 text-sm text-slate-500 bg-white rounded">No appointments found.</div>
        ) : appointments.map((a) => (
          <div key={a._id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-medium">{a.doctor}</p>
              <p className="text-xs text-slate-400">{a.department} • {a.location}</p>
              <p className="text-xs text-slate-500 mt-1">{formatDate(a.date)} • {a.time}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(a.status)}`}>{a.status}</span>
              {a.status !== 'Cancelled' && (
                <button onClick={() => onCancel(a._id)} className="text-xs text-rose-600">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Medical Panel ---- */
function MedicalPanel({ reports, onDownload, onUpload, setTab }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      e.target.value = ''; // reset input
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Medical Records & Reports</h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 rounded-md border border-slate-100 bg-white cursor-pointer">
            Upload
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
          <button onClick={() => alert('Bulk download (placeholder)')} className="px-3 py-2 rounded-md bg-sky-50 text-sky-700 text-sm">Download all</button>
        </div>
      </div>

      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="p-4 text-sm text-slate-500 bg-white rounded">No reports found.</div>
        ) : reports.map((r) => (
          <div key={r._id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-slate-400">By {r.doctor ?? 'Unknown'}</p>
              <p className="text-xs text-slate-500 mt-1">{formatDate(r.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => alert('View report (placeholder)')} className="text-xs text-sky-600">View</button>
              <button onClick={() => onDownload(r._id)} className="text-xs text-sky-600 flex items-center gap-2">
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Profile Panel ---- */
function ProfilePanel({ userInfo, onEdit }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`h-20 w-20 rounded-lg flex items-center justify-center text-white ${userInfo?.avatarColor ?? 'bg-slate-300'}`}>
            {userInfo?.photoUrl ? <img src={userInfo.photoUrl} alt="avatar" className="h-full w-full object-cover rounded-lg" /> : <span className="font-bold text-xl">{(userInfo?.name || 'JD').split(' ').map(n => n[0]).join('')}</span>}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{userInfo?.name}</h3>
            <p className="text-sm text-slate-500">{userInfo?.email}</p>
            <p className="text-xs text-slate-400">{userInfo?.phone}</p>
          </div>
        </div>

        <div className="text-sm text-slate-700 space-y-2 mt-4">
          <p><strong>Role:</strong> {userInfo?.role ?? 'patient'}</p>
          {/* If doctor fields are present, show them */}
          {userInfo?.role === 'doctor' && (
            <>
              <p><strong>Specialty:</strong> {userInfo?.specialty || '—'}</p>
              <p><strong>Department:</strong> {userInfo?.department || '—'}</p>
              <p><strong>Experience:</strong> {userInfo?.experience ? `${userInfo.experience} years` : '—'}</p>
              <p><strong>Timing:</strong> {userInfo?.timing || '—'}</p>
              <p><strong>Patients:</strong> {userInfo?.patients || '—'}</p>
              {userInfo?.bio && <p><strong>Bio:</strong> {userInfo.bio}</p>}
            </>
          )}

          {userInfo?.role !== 'doctor' && (
            <>
              <p><strong>Date of Birth:</strong> March 15, 1985</p>
              <p><strong>Verified:</strong> {userInfo?.verified ? 'Yes' : 'No'}</p>
              <p><strong>Status:</strong> {userInfo?.status ?? 'active'}</p>
            </>
          )}
        </div>

        <div className="mt-4">
          <button onClick={onEdit} className="px-3 py-2 rounded-md bg-sky-50 text-sky-700">Edit Profile</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Emergency Contact</h3>
        <div className="text-sm text-slate-700 space-y-2">
          <p><strong>Contact Name:</strong> Jane Doe</p>
          <p><strong>Relationship:</strong> Spouse</p>
          <p><strong>Phone:</strong> +91 98765 43211</p>
          <p><strong>Address:</strong> 123 Health Street, Medical City</p>
        </div>
        <div className="mt-4">
          <button onClick={() => alert('Update contact (placeholder)')} className="px-3 py-2 rounded-md bg-sky-50 text-sky-700">Update Contact</button>
        </div>
      </div>
    </div>
  );
}

/* ---- Helpers ---- */
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}