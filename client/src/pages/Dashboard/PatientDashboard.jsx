import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays,
  FileText,
  Heart,
  User,
  Bell,
  Download,
  Phone,
} from 'lucide-react';

/**
 * PatientDashboard.jsx
 * - Single-file Tailwind UI for patient dashboard
 * - Replace the placeholder fetch* functions with real API calls (axios/api wrapper)
 * - No external CSS files required
 */

export default function PatientDashboard() {
  const [tab, setTab] = useState('overview'); // overview | appointments | medical | profile
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // data state
  const [userInfo, setUserInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);

  // status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // refs for click-outside handling
  const notifRef = useRef(null);

  // -------------------------
  // Simulated fetch functions
  // Replace these with real API calls (axios / fetch / your api.js)
  // Example: await api.get('/patients/me') etc.
  // -------------------------
  async function fetchUser() {
    // TODO: replace with: const res = await api.get('/auth/me');
    return {
      id: 'TH001234',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 98765 43210',
      avatarColor: 'bg-gradient-to-br from-sky-400 to-cyan-500',
      active: true,
    };
  }

  async function fetchAppointments() {
    // TODO: replace with: const res = await api.get(`/patients/${id}/appointments`)
    return [
      {
        id: 'a1',
        doctor: 'Dr. Sarah Johnson',
        department: 'Cardiology',
        date: '2025-08-15',
        time: '10:30 AM',
        status: 'Confirmed',
        location: 'Room 402, Main Wing',
      },
      {
        id: 'a2',
        doctor: 'Dr. Michael Chen',
        department: 'Orthopedics',
        date: '2025-08-20',
        time: '02:00 PM',
        status: 'Pending',
        location: 'Room 101, West Wing',
      },
    ];
  }

  async function fetchReports() {
    // TODO: replace with: const res = await api.get(`/patients/${id}/reports`)
    return [
      { id: 'r1', title: 'Blood Test Report', doctor: 'Dr. Sarah Johnson', date: '2025-07-28', note: 'Normal' },
      { id: 'r2', title: 'Chest X-Ray', doctor: 'Dr. Michael Chen', date: '2025-06-10', note: 'No issues detected' },
      { id: 'r3', title: 'ECG Report', doctor: 'Dr. Sarah Johnson', date: '2025-05-02', note: 'Normal sinus rhythm' },
    ];
  }

  // -------------------------
  // Load data
  // -------------------------
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [u, appts, rpts] = await Promise.all([fetchUser(), fetchAppointments(), fetchReports()]);
        if (!mounted) return;
        setUserInfo(u);
        setAppointments(appts || []);
        setReports(rpts || []);
      } catch (err) {
        console.error('Error loading dashboard data', err);
        if (mounted) setError('Failed to load data. Try again later.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // -------------------------
  // Derived stats
  // -------------------------
  const stats = useMemo(() => {
    const upcoming = appointments.filter((a) => new Date(a.date) >= new Date()).length;
    return [
      { id: 's1', icon: <CalendarDays size={24} />, label: 'Upcoming', value: upcoming },
      { id: 's2', icon: <FileText size={24} />, label: 'Reports', value: reports.length },
      { id: 's3', icon: <Heart size={24} />, label: 'Health', value: 'Good' },
      { id: 's4', icon: <User size={24} />, label: 'Patient ID', value: userInfo?.id ?? '—' },
    ];
  }, [appointments, reports, userInfo]);

  // -------------------------
  // Notifications: close on outside click or Esc
  // -------------------------
  useEffect(() => {
    function onDocClick(e) {
      if (!notifRef.current) return;
      if (!notifRef.current.contains(e.target)) setNotificationsOpen(false);
    }
    function onEsc(e) {
      if (e.key === 'Escape') setNotificationsOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // -------------------------
  // Status badge helper
  // -------------------------
  const statusClasses = (status) =>
    status?.toLowerCase().includes('confirm')
      ? 'bg-blue-100 text-blue-700'
      : status?.toLowerCase().includes('pending')
      ? 'bg-amber-100 text-amber-700'
      : 'bg-gray-100 text-gray-700';

  // -------------------------
  // Handlers (safe placeholders)
  // -------------------------
  const handleReschedule = (id) => {
    // TODO: open reschedule modal and call PATCH /appointments/:id
    alert(`Reschedule ${id} — implement modal & API call`);
  };

  const handleCancel = async (id) => {
    // TODO: call DELETE /appointments/:id, optimistically update UI
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDownloadReport = (id) => {
    // TODO: call GET /reports/:id/download and stream file
    alert(`Download ${id} — implement file download from backend`);
  };

  const handleLogout = () => {
    // TODO: perform API logout if needed, clear localStorage token + user
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // optionally redirect to home/login
    window.location.href = '/';
  };

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
              <span className="text-xs text-slate-400">ID: {userInfo?.id ?? '—'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification button */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen((s) => !s)}
                aria-expanded={notificationsOpen}
                aria-haspopup="true"
                className="p-2 rounded-md hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium leading-none text-white bg-rose-500 rounded-full">
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-md shadow-lg border border-slate-100 p-3 z-20">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold">Notifications</h4>
                    <small className="text-xs text-slate-400">Recent</small>
                  </div>
                  <ul className="divide-y divide-slate-100 text-sm">
                    <li className="py-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Appointment confirmed</p>
                          <p className="text-xs text-slate-500">Dr. Sarah Johnson — Aug 15</p>
                        </div>
                        <span className="text-xs text-slate-400">1h</span>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">New medical report</p>
                          <p className="text-xs text-slate-500">Blood Test — Jul 28</p>
                        </div>
                        <span className="text-xs text-slate-400">2d</span>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Message from Dr. Chen</p>
                          <p className="text-xs text-slate-500">Check your recent X-Ray</p>
                        </div>
                        <span className="text-xs text-slate-400">3d</span>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>

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
          {/* Error / Loading */}
          {error && (
            <div className="mb-4 text-sm text-rose-600 bg-rose-50 p-3 rounded">{error}</div>
          )}

          {loading ? (
            <div className="py-16 flex items-center justify-center text-slate-400">Loading dashboard...</div>
          ) : (
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
                    <OverviewPanel appointments={appointments} reports={reports} userInfo={userInfo} statusClasses={statusClasses} />
                  </section>
                )}

                {tab === 'appointments' && (
                  <section id="panel-appointments" role="tabpanel" aria-labelledby="tab-appointments">
                    <AppointmentsPanel appointments={appointments} statusClasses={statusClasses} onReschedule={handleReschedule} onCancel={handleCancel} />
                  </section>
                )}

                {tab === 'medical' && (
                  <section id="panel-medical" role="tabpanel" aria-labelledby="tab-medical">
                    <MedicalPanel reports={reports} onDownload={handleDownloadReport} />
                  </section>
                )}

                {tab === 'profile' && (
                  <section id="panel-profile" role="tabpanel" aria-labelledby="tab-profile">
                    <ProfilePanel userInfo={userInfo} onEdit={() => alert('Edit Profile (placeholder)')} />
                  </section>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Reusable components below
   ------------------------- */

function OverviewPanel({ appointments, reports, userInfo, statusClasses }) {
  const next = appointments[0];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-2">Next Appointment</h3>
        {next ? (
          <>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-sky-100 text-sky-700 font-semibold">
                {next.doctor.split(' ').slice(-1)[0][0]}
              </div>
              <div>
                <p className="font-semibold">{next.doctor}</p>
                <p className="text-xs text-slate-500">{next.department}</p>
                <p className="text-sm text-slate-600 mt-1">{formatDate(next.date)} • {next.time}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(next.status)}`}>{next.status}</span>
              <div className="flex items-center gap-2">
                <button className="text-xs text-sky-600 hover:underline">Directions</button>
                <button className="text-xs text-slate-500">Details</button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500">No upcoming appointments.</p>
        )}
      </div>

      <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-2">Health Snapshot</h3>
        <p className="text-green-600 font-semibold">Good</p>
        <p className="text-xs text-slate-500 mt-2">Last check-up: {reports[0]?.date || '—'}</p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/60 rounded-md p-2 border border-slate-100">
            <p className="text-slate-400">Blood Pressure</p>
            <p className="font-semibold">Normal</p>
          </div>
          <div className="bg-white/60 rounded-md p-2 border border-slate-100">
            <p className="text-slate-400">Heart Rate</p>
            <p className="font-semibold">72 bpm</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-white to-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-2">Recent Reports</h3>
        <p className="text-sm text-slate-500">{reports.length} Reports</p>
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-1 rounded-md bg-sky-50 text-sky-700 text-sm">View all</button>
          <button className="px-3 py-1 rounded-md border border-slate-100 text-sm">Download</button>
        </div>
      </div>

      {/* Appointments list (wide) */}
      <div className="md:col-span-2 mt-4">
        <h4 className="text-sm font-semibold mb-3">Upcoming Appointments</h4>
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 bg-white rounded">No upcoming appointments.</div>
          ) : appointments.map((a) => (
            <div key={a.id} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-sky-50 text-sky-700 font-semibold">
                  {a.doctor.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <p className="font-medium">{a.doctor}</p>
                  <p className="text-xs text-slate-400">{a.department} • {a.location}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(a.date)} • {a.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(a.status)}`}>{a.status}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => alert('Open reschedule modal (placeholder)')} className="text-xs text-sky-600">Reschedule</button>
                  <button onClick={() => alert('Open cancel confirmation (placeholder)')} className="text-xs text-rose-600">Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Quick Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
            <CalendarDays size={16} /> Book Appointment
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
            <FileText size={16} /> View Medical Records
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
            <Download size={16} /> Download Reports
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-slate-100 shadow-sm hover:shadow-md transition">
            <Phone size={16} /> Contact Doctor
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Appointments Panel ---- */
function AppointmentsPanel({ appointments, statusClasses, onReschedule, onCancel }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => alert('Open appointment booking')} className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-500 text-white hover:brightness-95 transition">
          + Book New Appointment
        </button>
      </div>

      <h3 className="text-sm font-semibold mb-3">All Appointments</h3>
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <div className="p-4 text-sm text-slate-500 bg-white rounded">No appointments found.</div>
        ) : appointments.map((a) => (
          <div key={a.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-medium">{a.doctor}</p>
              <p className="text-xs text-slate-400">{a.department} • {a.location}</p>
              <p className="text-xs text-slate-500 mt-1">{formatDate(a.date)} • {a.time}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(a.status)}`}>{a.status}</span>
              <button onClick={() => onReschedule(a.id)} className="text-xs text-sky-600">Reschedule</button>
              <button onClick={() => onCancel(a.id)} className="text-xs text-rose-600">Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Medical Panel ---- */
function MedicalPanel({ reports, onDownload }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Medical Records & Reports</h3>
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="p-4 text-sm text-slate-500 bg-white rounded">No reports found.</div>
        ) : reports.map((r) => (
          <div key={r.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-slate-400">By {r.doctor}</p>
              <p className="text-xs text-slate-500 mt-1">{r.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => alert('View report (placeholder)')} className="text-xs text-sky-600">View</button>
              <button onClick={() => onDownload(r.id)} className="text-xs text-sky-600 flex items-center gap-2">
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
        <h3 className="text-sm font-semibold mb-3">Personal Information</h3>
        <div className="text-sm text-slate-700 space-y-2">
          <p><strong>Full Name:</strong> {userInfo?.name}</p>
          <p><strong>Email:</strong> {userInfo?.email}</p>
          <p><strong>Phone:</strong> {userInfo?.phone}</p>
          <p><strong>Date of Birth:</strong> March 15, 1985</p>
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
