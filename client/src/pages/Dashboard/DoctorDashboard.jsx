// client/src/pages/Dashboard/DoctorDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  User,
  ClipboardList,
  FileText,
  Stethoscope,
  Clock,
  Search,
  Settings,
} from 'lucide-react';

/**
 * DoctorDashboard.jsx
 * - Keeps your original UI style
 * - Removes Prescriptions (doctors write on paper/EMR outside this app)
 * - Settings now includes profile fields and Change Password inputs
 * - All network calls are TODO placeholders — replace with your axios/api wrapper when ready
 */

export default function DoctorDashboard() {
  const [tab, setTab] = useState('overview'); // overview | schedule | patients | reports | settings
  const [isLoading, setIsLoading] = useState(true);

  // domain state
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);

  // schedule (doctor availability) kept locally until you persist it
  const [availability, setAvailability] = useState([
    // sample: { day: 'Mon', from: '09:00', to: '13:00' }
  ]);

  // small form state for upload/create
  const [reportForm, setReportForm] = useState({ patientId: '', title: '', file: null, note: '' });
  const [availForm, setAvailForm] = useState({ day: 'Mon', from: '09:00', to: '13:00' });
  const [settingsForm, setSettingsForm] = useState({ specialization: '', workingHours: '09:00-18:00', currentPassword: '', newPassword: '', confirmPassword: '' });

  // load mock data (replace with API)
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => {
      setDoctor({
        id: 'D10021',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        email: 'sarah.johnson@hospital.com',
      });

      setAppointments([
        { id: 'ap1', patientId: 'p1', patient: 'John Doe', date: todayISO(), time: '09:00', reason: 'Follow-up', status: 'Confirmed', room: '402' },
        { id: 'ap2', patientId: 'p2', patient: 'Mary Smith', date: todayISO(), time: '10:00', reason: 'ECG Review', status: 'Confirmed', room: '402' },
        { id: 'ap3', patientId: 'p3', patient: 'Amit Verma', date: todayISO(), time: '11:30', reason: 'Chest Pain', status: 'Pending', room: '403' },
        { id: 'ap4', patientId: 'p4', patient: 'Lina Park', date: addDaysISO(1), time: '14:00', reason: 'BP Check', status: 'Confirmed', room: '305' },
      ]);

      setPatients([
        { id: 'p1', name: 'John Doe', lastVisit: '2025-07-28', conditions: ['Hypertension'], notes: [], reports: [] },
        { id: 'p2', name: 'Mary Smith', lastVisit: '2025-07-20', conditions: ['Arrhythmia'], notes: [], reports: [] },
        { id: 'p3', name: 'Amit Verma', lastVisit: '2025-06-30', conditions: ['Chest pain'], notes: [], reports: [] },
      ]);

      setReports([
        { id: 'r1', title: 'ECG Report', patientId: 'p1', patient: 'John Doe', doctorId: 'D10021', date: '2025-07-28', fileName: 'ecg-john.pdf' },
      ]);

      setAvailability([
        { day: 'Mon', from: '09:00', to: '13:00' },
        { day: 'Tue', from: '09:00', to: '13:00' },
        { day: 'Thu', from: '14:00', to: '18:00' },
      ]);

      setSettingsForm({ specialization: 'Cardiology', workingHours: '09:00-18:00', currentPassword: '', newPassword: '', confirmPassword: '' });

      setIsLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, []);

  // derived summary stats
  const stats = useMemo(() => {
    const todayCount = appointments.filter(a => a.date === todayISO()).length;
    const pending = appointments.filter(a => a.status === 'Pending').length;
    return [
      { id: 's1', icon: <CalendarDays size={22} />, label: "Today's Appointments", value: todayCount },
      { id: 's2', icon: <ClipboardList size={22} />, label: 'Pending Cases', value: pending },
      { id: 's3', icon: <User size={22} />, label: 'Active Patients', value: patients.length },
      { id: 's4', icon: <Stethoscope size={22} />, label: 'Doctor ID', value: doctor?.id ?? '—' },
    ];
  }, [appointments, patients, doctor]);

  // ----- Handlers (replace the internals with real API calls) -----
  const handleMarkComplete = async (id) => {
    // TODO: await api.patch(`/api/doctor/appointments/${id}/complete`);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Completed' } : a));
  };

  const handleReschedule = async (id) => {
    // we keep a simple prompt here — in prod use a modal with datepicker & validation
    const newDate = prompt('Enter new date (YYYY-MM-DD):', todayISO());
    if (!newDate) return;
    const newTime = prompt('Enter new time (HH:MM 24h):', '10:00');
    if (!newTime) return;
    // TODO: await api.patch(`/api/doctor/appointments/${id}/reschedule`, { date: newDate, time: newTime });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, time: newTime, status: 'Confirmed' } : a));
  };

  const handleAddNote = async (patientId) => {
    const text = prompt('Add a medical note:');
    if (!text) return;
    // TODO: await api.post(`/api/patients/${patientId}/notes`, { text, doctorId: doctor.id })
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, notes: [{ text, date: new Date().toISOString() }, ...(p.notes || [])] } : p));
    alert('Note saved (local only). Replace with API call to persist.');
  };

  const handleUploadReport = async (e) => {
    e.preventDefault();
    if (!reportForm.patientId || !reportForm.title || !reportForm.file) {
      alert('Please fill patient, title and attach a file.');
      return;
    }
    // TODO: send FormData to your backend: /api/reports (attach file, doctorId, patientId)
    const id = `r_${Date.now()}`;
    const patient = patients.find(p => p.id === reportForm.patientId);
    const newReport = {
      id,
      title: reportForm.title,
      patientId: reportForm.patientId,
      patient: patient?.name || 'Patient',
      doctorId: doctor?.id,
      date: todayISO(),
      fileName: reportForm.file.name || 'file.pdf',
    };
    setReports(prev => [newReport, ...prev]);
    // add to patient
    setPatients(prev => prev.map(p => p.id === reportForm.patientId ? { ...p, reports: [newReport.fileName, ...(p.reports||[])] } : p));
    setReportForm({ patientId: '', title: '', file: null, note: '' });
    alert('Report uploaded (local). Replace with API upload to persist.');
  };

  const handleAddAvailability = (e) => {
    e.preventDefault();
    if (!availForm.day || !availForm.from || !availForm.to) return;
    setAvailability(prev => [...prev, { ...availForm }]);
    setAvailForm({ day: 'Mon', from: '09:00', to: '13:00' });
    // TODO: persist to /api/doctor/:id/availability
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // if user wants to change password, validate:
    if (settingsForm.newPassword || settingsForm.confirmPassword) {
      if (settingsForm.newPassword !== settingsForm.confirmPassword) {
        alert('New password and confirmation do not match.');
        return;
      }
      if (!settingsForm.currentPassword) {
        alert('Enter your current password to change it.');
        return;
      }
      // TODO: call API to change password: POST /api/auth/change-password { currentPassword, newPassword }
      // if success, clear password fields
      setSettingsForm(s => ({ ...s, currentPassword: '', newPassword: '', confirmPassword: '' }));
      alert('Password change requested (local). Implement backend call.');
    }

    // Save profile fields
    setDoctor(prev => ({ ...prev, specialty: settingsForm.specialization }));
    // TODO: PUT /api/doctor/:id to persist workingHours and specialization
    alert('Settings saved locally. Replace with API call to persist.');
  };

  // ----- Helper UI functions -----
  const findPatient = (id) => patients.find(p => p.id === id) || {};
  const patientChoices = patients.map(p => ({ id: p.id, name: p.name }));

  // ----- UI -----
  return (
    <div className="min-h-screen bg-[#f8feff] text-slate-800 antialiased">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Doctor Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome, <span className="font-semibold">{doctor?.name ?? '—'}</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-xs text-slate-400">{doctor?.specialty ?? '—'}</span>
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border">
            <div className="h-9 w-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">
              {doctor?.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
            </div>
            <div>
              <p className="text-sm font-medium">{doctor?.name ?? '—'}</p>
              <p className="text-xs text-slate-400">{doctor?.email ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-100 shadow-sm">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.id} className="bg-gradient-to-br from-white/60 to-slate-50 rounded-xl p-4 border shadow-sm flex items-center gap-4">
                <div className="rounded-lg p-2 bg-white border">{s.icon}</div>
                <div>
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="font-semibold text-lg mt-1">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-5 w-full bg-sky-50 rounded-md overflow-hidden border border-slate-200 mb-5">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'schedule', label: 'Schedule' },
              { key: 'patients', label: 'Patients' },
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

          {/* Content */}
          {isLoading ? (
            <div className="py-16 flex items-center justify-center text-slate-400">Loading doctor view…</div>
          ) : (
            <>
              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Next patient */}
                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Next Patient</h3>
                    {appointments[0] ? (
                      <>
                        <p className="font-semibold">{appointments[0].patient}</p>
                        <p className="text-xs text-slate-400">{appointments[0].reason}</p>
                        <p className="text-sm text-slate-600 mt-1">{formatDate(appointments[0].date)} • {appointments[0].time} • Room {appointments[0].room}</p>
                        <div className="mt-3 flex gap-2">
                          <button className="text-xs text-sky-600" onClick={() => handleMarkComplete(appointments[0].id)}>Mark Complete</button>
                          <button className="text-xs text-slate-600" onClick={() => handleReschedule(appointments[0].id)}>Reschedule</button>
                        </div>
                      </>
                    ) : <p className="text-sm text-slate-500">No upcoming appointments.</p>}
                  </div>

                  {/* Today's schedule */}
                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Today's Schedule</h3>
                    <ul className="space-y-2 text-sm">
                      {appointments.filter(a => a.date === todayISO()).map(a => (
                        <li key={a.id} className="flex items-center justify-between bg-white border rounded-md p-2">
                          <div>
                            <p className="font-medium">{a.patient}</p>
                            <p className="text-xs text-slate-500">{a.time} • {a.reason}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(a.status)}`}>{a.status}</span>
                            <button className="text-xs text-sky-600" onClick={() => handleReschedule(a.id)}>Reschedule</button>
                            <button className="text-xs text-emerald-600" onClick={() => handleMarkComplete(a.id)}>Complete</button>
                          </div>
                        </li>
                      ))}
                      {appointments.filter(a => a.date === todayISO()).length === 0 && <li className="text-sm text-slate-500">No appointments today.</li>}
                    </ul>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setTab('schedule')} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <CalendarDays size={16} /> Manage Slots
                      </button>
                      <button onClick={() => setTab('patients')} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <User size={16} /> Patients
                      </button>
                      <button onClick={() => setTab('reports')} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <FileText size={16} /> Upload Report
                      </button>
                      <button onClick={() => setTab('settings')} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <Settings size={16} /> Settings
                      </button>
                    </div>
                  </div>

                  {/* upcoming list across bottom */}
                  <div className="md:col-span-3 mt-4">
                    <h4 className="text-sm font-semibold mb-3">Upcoming Appointments</h4>
                    <div className="space-y-2">
                      {appointments.map(a => (
                        <div key={a.id} className="bg-white rounded-xl p-3 border shadow-sm flex items-center justify-between">
                          <div>
                            <p className="font-medium">{a.patient}</p>
                            <p className="text-xs text-slate-400">{formatDate(a.date)} • {a.time} • Room {a.room}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(a.status)}`}>{a.status}</span>
                            <button className="text-xs text-sky-600" onClick={() => handleReschedule(a.id)}>Reschedule</button>
                            <button className="text-xs text-emerald-600" onClick={() => handleMarkComplete(a.id)}>Complete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SCHEDULE */}
              {tab === 'schedule' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} />
                    <h3 className="text-sm font-semibold">Manage Availability</h3>
                  </div>

                  <div className="bg-white border rounded-xl p-4 shadow-sm mb-4">
                    <p className="text-sm text-slate-500 mb-3">Your weekly availability. Persist to backend when ready.</p>

                    <form onSubmit={handleAddAvailability} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                      <div>
                        <label className="text-xs text-slate-600">Day</label>
                        <select className="w-full border rounded px-2 py-2" value={availForm.day} onChange={e => setAvailForm(f=>({ ...f, day: e.target.value }))}>
                          <option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-600">From</label>
                        <input type="time" className="w-full border rounded px-2 py-2" value={availForm.from} onChange={e => setAvailForm(f=>({ ...f, from: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-600">To</label>
                        <input type="time" className="w-full border rounded px-2 py-2" value={availForm.to} onChange={e => setAvailForm(f=>({ ...f, to: e.target.value }))} />
                      </div>
                      <div>
                        <button type="submit" className="px-3 py-2 bg-sky-500 text-white rounded-md">Add Availability</button>
                      </div>
                    </form>

                    <div className="mt-4 space-y-2">
                      {availability.map((a,i) => (
                        <div key={i} className="flex items-center justify-between bg-white border rounded-md p-2">
                          <div className="text-sm">{a.day} — {a.from} to {a.to}</div>
                          <div className="text-xs text-slate-400">Local only (persist when backend ready)</div>
                        </div>
                      ))}
                      {availability.length === 0 && <div className="text-sm text-slate-500">No availability set.</div>}
                    </div>
                  </div>

                  <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <h4 className="text-sm font-semibold mb-2">Appointments Calendar (compact)</h4>
                    <p className="text-sm text-slate-500 mb-3">A weekly calendar view is recommended here (use FullCalendar / react-big-calendar when integrating).</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {appointments.map(a => (
                        <div key={a.id} className="p-2 border rounded">
                          <div className="text-sm font-medium">{a.patient} — {a.time}</div>
                          <div className="text-xs text-slate-500">{formatDate(a.date)} • {a.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PATIENTS */}
              {tab === 'patients' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User size={16} />
                    <h3 className="text-sm font-semibold">My Patients</h3>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-2 bg-white border rounded-md px-3 py-2 w-full md:w-96">
                      <Search size={16} />
                      <input className="outline-none text-sm w-full" placeholder="Search patient…" onChange={() => { /* add search if required */ }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {patients.map(p => (
                      <div key={p.id} className="bg-white border rounded-xl p-3 shadow-sm flex items-start justify-between">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-slate-400">Last visit: {formatDate(p.lastVisit)}</p>
                          <p className="text-xs text-slate-400">Conditions: {p.conditions.join(', ')}</p>

                          {/* notes & reports preview */}
                          <div className="mt-2 text-xs">
                            <div className="text-slate-600">Notes: { (p.notes || []).length }</div>
                            <div className="text-slate-600">Reports: { (p.reports || []).length }</div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {(p.reports || []).length > 0 ? (
                            <button className="text-xs text-sky-600" onClick={() => alert(`Open reports for ${p.name} (implement)`)}>
                              View Reports
                            </button>
                          ) : (
                            <button className="text-xs text-slate-500">No Reports</button>
                          )}
                          <button className="text-xs text-slate-600" onClick={() => handleAddNote(p.id)}>Add Note</button>
                        </div>
                      </div>
                    ))}
                    {patients.length === 0 && <div className="p-4 text-sm text-slate-500 bg-white rounded border">No patients assigned.</div>}
                  </div>
                </div>
              )}

              {/* REPORTS */}
              {tab === 'reports' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Reports</h3>
                    <div>
                      <button onClick={() => alert('Open full reports list (implement)')} className="px-3 py-2 rounded-md border">All Reports</button>
                    </div>
                  </div>

                  <div className="bg-white border rounded-xl p-4 shadow-sm mb-4">
                    <form onSubmit={handleUploadReport} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                        <label className="text-xs text-slate-600">Patient</label>
                        <select className="w-full border rounded px-2 py-2" value={reportForm.patientId} onChange={e => setReportForm(f => ({ ...f, patientId: e.target.value }))}>
                          <option value="">Select patient</option>
                          {patientChoices.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-600">Title</label>
                        <input className="w-full border rounded px-2 py-2" value={reportForm.title} onChange={e => setReportForm(f => ({ ...f, title: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-600">File</label>
                        <input type="file" className="w-full" onChange={e => setReportForm(f => ({ ...f, file: e.target.files?.[0] || null }))} />
                      </div>
                      <div>
                        <button type="submit" className="px-3 py-2 bg-sky-500 text-white rounded-md">Upload</button>
                      </div>
                    </form>
                  </div>

                  <div className="space-y-2">
                    {reports.map(r => (
                      <div key={r.id} className="bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-medium">{r.title}</p>
                          <p className="text-xs text-slate-400">{r.patient} • {formatDate(r.date)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-sky-600" onClick={() => alert(`Download ${r.fileName} (implement)`)}>Download</button>
                          <button className="text-xs text-slate-600" onClick={() => alert(`View ${r.title} (implement)`)}>View</button>
                        </div>
                      </div>
                    ))}
                    {reports.length === 0 && <div className="p-4 text-sm text-slate-500 bg-white rounded border">No reports found.</div>}
                  </div>
                </div>
              )}

              {/* SETTINGS */}
{/* SETTINGS */}
{tab === 'settings' && (
  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-6 shadow-sm">
    <h3 className="text-sm font-semibold mb-4">Profile Settings</h3>

    <form className="space-y-4" onSubmit={handleSaveSettings}>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2"
          value={doctor?.name || ''}
          onChange={e => setDoctor(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2"
          value={doctor?.email || ''}
          onChange={e => setDoctor(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2"
          value={doctor?.phone || ''}
          onChange={e => setDoctor(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            value={settingsForm.currentPassword}
            onChange={e => setSettingsForm(f => ({ ...f, currentPassword: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            value={settingsForm.newPassword}
            onChange={e => setSettingsForm(f => ({ ...f, newPassword: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2"
          value={settingsForm.confirmPassword}
          onChange={e => setSettingsForm(f => ({ ...f, confirmPassword: e.target.value }))}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-sky-600 text-white rounded-md"
      >
        Save Settings
      </button>
    </form>
  </div>
)}

            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------- helpers ------------------- */
function todayISO() {
  const d = new Date(); d.setHours(0,0,0,0); return d.toISOString().slice(0,10);
}
function addDaysISO(n) {
  const d = new Date(); d.setDate(d.getDate()+n); d.setHours(0,0,0,0); return d.toISOString().slice(0,10);
}
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function statusClasses(status) {
  return status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
         status === 'Pending' ? 'bg-amber-100 text-amber-700' :
         status === 'Completed' ? 'bg-slate-200 text-slate-700' :
         'bg-slate-100 text-slate-700';
}
