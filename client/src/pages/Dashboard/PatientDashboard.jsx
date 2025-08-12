import React, { useEffect, useMemo, useState } from 'react';
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
 * Single-file, Tailwind-only Patient Dashboard UI.
 *
 * Notes:
 * - Uses Tailwind utility classes only (no separate CSS file).
 * - Icons are from lucide-react (install above).
 * - Replace dummy fetches below with your API endpoints.
 */

export default function PatientDashboard() {
  // UI state
  const [tab, setTab] = useState('overview'); // overview | appointments | medical | profile
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Data state (replace these with real API calls)
  const [userInfo, setUserInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetch (replace with fetch/axios to your backend)
  useEffect(() => {
    setIsLoading(true);

    // Fake async load
    const timer = setTimeout(() => {
      setUserInfo({
        id: 'TH001234',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+91 98765 43210',
        avatarColor: 'bg-gradient-to-br from-sky-400 to-cyan-500',
        active: true,
      });

      setAppointments([
        {
          id: 'a1',
          doctor: 'Dr. Sarah Johnson',
          photo: null,
          department: 'Cardiology',
          date: '2025-08-15',
          time: '10:30 AM',
          status: 'Confirmed',
          location: 'Room 402, Main Wing',
        },
        {
          id: 'a2',
          doctor: 'Dr. Michael Chen',
          photo: null,
          department: 'Orthopedics',
          date: '2025-08-20',
          time: '02:00 PM',
          status: 'Pending',
          location: 'Room 101, West Wing',
        },
      ]);

      setReports([
        {
          id: 'r1',
          title: 'Blood Test Report',
          doctor: 'Dr. Sarah Johnson',
          date: '2025-07-28',
          note: 'Normal',
        },
        {
          id: 'r2',
          title: 'Chest X-Ray',
          doctor: 'Dr. Michael Chen',
          date: '2025-06-10',
          note: 'No issues detected',
        },
        {
          id: 'r3',
          title: 'ECG Report',
          doctor: 'Dr. Sarah Johnson',
          date: '2025-05-02',
          note: 'Normal sinus rhythm',
        },
      ]);

      setIsLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    const upcoming = appointments.filter((a) => new Date(a.date) >= new Date()).length;
    const reportsCount = reports.length;
    return [
      { id: 's1', icon: <CalendarDays size={28} />, label: 'Upcoming Appointments', value: upcoming },
      { id: 's2', icon: <FileText size={28} />, label: 'Medical Reports', value: reportsCount },
      { id: 's3', icon: <Heart size={28} />, label: 'Health Status', value: 'Good' },
      { id: 's4', icon: <User size={28} />, label: 'Patient ID', value: userInfo?.id || '—' },
    ];
  }, [appointments, reports, userInfo]);

  // Small utility: status badge color
  const statusClasses = (status) =>
    status.toLowerCase().includes('confirm')
      ? 'bg-blue-100 text-blue-700'
      : status.toLowerCase().includes('pending')
      ? 'bg-amber-100 text-amber-700'
      : 'bg-gray-100 text-gray-700';

  // Handlers for future API integration
  const handleReschedule = (id) => {
    alert(`Reschedule clicked for appointment ${id} — hook this to your reschedule modal/api.`);
  };

  const handleCancel = (id) => {
    const confirmed = confirm('Are you sure you want to cancel this appointment?');
    if (!confirmed) return;
    // replace with API call to cancel, then refresh list
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDownloadReport = (id) => {
    alert(`Downloading report ${id} — replace with real download link.`);
  };

  const handleLogout = () => {
    // replace with real logout logic
    alert('Logging out (replace with real logic).');
  };

  // Layout
  return (
    <div className="min-h-screen bg-[#f8feff] text-slate-800 antialiased">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
        {/* App Shell */}
        <div className="flex gap-6 w-full">
          {/* SIDEBAR removed no use */}


          {/* MAIN */}
          <main className="flex-1">
            {/* Topbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Patient Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Welcome back, <span className="font-semibold">{userInfo?.name || '—'}</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="text-xs text-slate-400">ID: {userInfo?.id || '—'}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Notification button */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen((s) => !s)}
                    className="p-2 rounded-md hover:bg-slate-100 transition"
                    aria-expanded={notificationsOpen}
                    aria-label="Toggle notifications"
                  >
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-rose-500 rounded-full">
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
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white ${userInfo?.avatarColor || 'bg-slate-300'}`}>
                    <span className="font-semibold">{userInfo?.name?.split(' ').map(n=>n[0]).join('') || 'JD'}</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium leading-none">{userInfo?.name || '—'}</p>
                    <p className="text-xs text-slate-400">{userInfo?.email || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTENT CARD */}
            <div className="bg-transparent rounded-xl">
              <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-100 shadow-sm">
                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {stats.map((s) => (
                    <div
                      key={s.id}
                      className="bg-gradient-to-br from-white/60 to-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition"
                    >
                      <div className="rounded-lg p-2 bg-white/80 border border-slate-100">
                        {s.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400">{s.label}</p>
                        <p className="font-semibold text-lg mt-1">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="flex items-end justify-between mb-5">
                <div className="grid grid-cols-4 w-full bg-sky-50 rounded-md overflow-hidden border border-slate-200">
                  {[
                    { key: 'overview', label: 'Overview' },
                    { key: 'appointments', label: 'Appointments' },
                    { key: 'medical', label: 'Medical Records' },
                    { key: 'profile', label: 'Profile' }
                  ].map((tabItem) => (
                    <button
                      key={tabItem.key}
                      onClick={() => setTab(tabItem.key)}
                      className={`py-2 text-sm font-medium transition ${
                        tab === tabItem.key
                          ? 'bg-white text-sky-700 shadow'
                          : 'text-slate-600 hover:bg-white/50'
                      }`}
                    >
                      {tabItem.label}
                    </button>
                  ))}
                </div>



                </div>

                {/* TAB PANELS */}
                <div>
                  {isLoading ? (
                    <div className="py-16 flex items-center justify-center text-slate-400">
                      Loading dashboard...
                    </div>
                  ) : (
                    <>
                      {tab === 'overview' && (
                        <OverviewPanel
                          appointments={appointments}
                          reports={reports}
                          userInfo={userInfo}
                          statusClasses={statusClasses}
                        />
                      )}

                      {tab === 'appointments' && (
                        <AppointmentsPanel
                          appointments={appointments}
                          statusClasses={statusClasses}
                          onReschedule={handleReschedule}
                          onCancel={handleCancel}
                        />
                      )}

                      {tab === 'medical' && (
                        <MedicalPanel reports={reports} onDownload={handleDownloadReport} />
                      )}

                      {tab === 'profile' && (
                        <ProfilePanel userInfo={userInfo} onEdit={() => alert('Edit Profile (placeholder)')} />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Reusable UI pieces below
   ------------------------- */

function NavItem({ icon, label, active, onClick, open }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-slate-50 transition ${
        active ? 'bg-sky-50 text-sky-700 font-semibold shadow-sm' : 'text-slate-600'
      }`}
      aria-pressed={active}
    >
      <div className="w-9 h-9 rounded-md flex items-center justify-center bg-white border border-slate-100 shadow">
        {icon}
      </div>
      {open && <span className="text-sm">{label}</span>}
    </button>
  );
}

/* ---- Overview Panel ---- */
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
              <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(next.status)}`}>
                {next.status}
              </span>
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
          {appointments.map((a) => (
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
      <h3 className="text-sm font-semibold mb-3">All Appointments</h3>
      <div className="space-y-3">
        <div className="flex justify-end mb-4">
  <button
    onClick={() => alert('Open appointment booking')}
    className="flex items-center gap-2 px-4 py-2 rounded-md bg-sky-500 text-white hover:brightness-95 transition"
  >
    + Book New Appointment
  </button>
</div>

        {appointments.map((a) => (
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
        {reports.map((r) => (
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
