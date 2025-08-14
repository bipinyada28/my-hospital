import React, { useEffect, useMemo, useState } from 'react';
import { Users, UserPlus, CalendarClock, FileText, Shield, Settings, Search, Trash2, Edit } from 'lucide-react';

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview'); // overview | users | appointments | reports | settings
  const [isLoading, setIsLoading] = useState(true);

  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Mock data — replace with GET /api/admin/metrics, /users, /appointments, /reports
      setMetrics({
        totalUsers: 1240,
        doctors: 42,
        patients: 1150,
        todayAppointments: 68,
        pendingReports: 7
      });

      setUsers([
        { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'patient', status: 'active' },
        { id: 'u2', name: 'Dr. Sarah Johnson', email: 'sarah@hospital.com', role: 'doctor', status: 'active' },
        { id: 'u3', name: 'Reception Desk', email: 'recp@hospital.com', role: 'staff', status: 'active' },
        { id: 'u4', name: 'Mary Smith', email: 'mary@example.com', role: 'patient', status: 'inactive' },
      ]);

      setAppointments([
        { id: 'a1', doctor: 'Dr. Johnson', patient: 'John Doe', date: todayISO(), time: '10:30 AM', status: 'Confirmed' },
        { id: 'a2', doctor: 'Dr. Chen', patient: 'Mary Smith', date: todayISO(), time: '02:00 PM', status: 'Pending' },
        { id: 'a3', doctor: 'Dr. Lee', patient: 'Amit Verma', date: addDaysISO(1), time: '09:00 AM', status: 'Confirmed' },
      ]);

      setReports([
        { id: 'r1', title: 'Blood Test', patient: 'John Doe', status: 'Pending', date: '2025-07-28' },
        { id: 'r2', title: 'X-Ray', patient: 'Mary Smith', status: 'Ready', date: '2025-07-25' },
      ]);

      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const cards = useMemo(() => ([
    { id: 'c1', icon: <Users size={22} />, label: 'Total Users', value: metrics?.totalUsers ?? '—' },
    { id: 'c2', icon: <Shield size={22} />, label: 'Active Doctors', value: metrics?.doctors ?? '—' },
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
    'bg-slate-100 text-slate-700';

  const handleUserToggle = (id) => {
    // TODO: PUT /api/admin/users/:id/toggle
    setUsers(prev => prev.map(u => u.id === id ? ({ ...u, status: u.status === 'active' ? 'inactive' : 'active' }) : u));
  };

  const handleUserDelete = (id) => {
    // TODO: DELETE /api/admin/users/:id
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleReportApprove = (id) => {
    // TODO: PUT /api/admin/reports/:id/approve
    setReports(prev => prev.map(r => r.id === id ? ({ ...r, status: 'Ready' }) : r));
  };

  return (
    <div className="min-h-screen bg-[#f8feff] text-slate-800 antialiased">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
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

          <div className="grid grid-cols-5 w-full bg-sky-50 rounded-md overflow-hidden border border-slate-200 mb-5">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'users', label: 'Users' },
              { key: 'appointments', label: 'Appointments' },
              { key: 'reports', label: 'Reports' },
              { key: 'settings', label: 'Settings' },
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
              {tab === 'overview' && (
                <div className="grid md:grid-cols-3 gap-4">
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

                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Pending Reports</h3>
                    <ul className="space-y-2 text-sm">
                      {reports.filter(r => r.status === 'Pending').map(r => (
                        <li key={r.id} className="flex items-center justify-between bg-white border rounded-md p-2">
                          <div>
                            <p className="font-medium">{r.title}</p>
                            <p className="text-xs text-slate-500">{r.patient} • {formatDate(r.date)}</p>
                          </div>
                          <button className="text-xs text-emerald-700" onClick={() => handleReportApprove(r.id)}>Approve</button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <UserPlus size={16} /> Add User
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <Settings size={16} /> System Config
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <CalendarClock size={16} /> Slots
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <FileText size={16} /> Reports
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-3 mt-4">
                    <h4 className="text-sm font-semibold mb-3">Recent Users</h4>
                    <div className="space-y-2">
                      {users.slice(0,5).map(u => (
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

              {tab === 'users' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 bg-white border rounded-md px-3 py-2 w-full md:w-96">
                      <Search size={16} />
                      <input className="outline-none text-sm w-full" placeholder="Search users by name/email…" />
                    </div>
                    <button className="px-3 py-2 rounded-md bg-sky-500 text-white">+ Add User</button>
                  </div>
                  <div className="space-y-2">
                    {users.map(u => (
                      <div key={u.id} className="bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-medium">{u.name}</p>
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
                  </div>
                </div>
              )}

              {tab === 'appointments' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Appointments</h3>
                    <div>
                      <button className="px-3 py-2 rounded-md border">Export</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {appointments.map(a => (
                      <div key={a.id} className="bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-medium">{a.patient} → {a.doctor}</p>
                          <p className="text-xs text-slate-400">{formatDate(a.date)} • {a.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${apptBadge(a.status)}`}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'reports' && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Reports</h3>
                  <div className="space-y-2">
                    {reports.map(r => (
                      <div key={r.id} className="bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-medium">{r.title}</p>
                          <p className="text-xs text-slate-400">{r.patient} • {formatDate(r.date)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{r.status}</span>
                          {r.status === 'Pending' && (
                            <button className="text-xs text-emerald-700" onClick={() => handleReportApprove(r.id)}>Approve</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'settings' && (
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm font-semibold mb-3">System Settings</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <p className="text-sm font-medium flex items-center gap-2"><Shield size={16}/> Security</p>
                      <div className="mt-2 space-y-2 text-sm">
                        <label className="flex items-center gap-2"><input type="checkbox" /> Require OTP for new devices</label>
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Enforce strong passwords</label>
                      </div>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-sm font-medium flex items-center gap-2"><Settings size={16}/> General</p>
                      <div className="mt-2 space-y-2 text-sm">
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Enable email notifications</label>
                        <label className="flex items-center gap-2"><input type="checkbox" /> Maintenance mode</label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="px-3 py-2 rounded-md bg-sky-500 text-white">Save Settings</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function todayISO() {
  const d = new Date(); d.setHours(0,0,0,0); return d.toISOString().slice(0,10);
}
function addDaysISO(n) {
  const d = new Date(); d.setDate(d.getDate()+n); d.setHours(0,0,0,0); return d.toISOString().slice(0,10);
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
