import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, User, ClipboardList, MessageSquare, Stethoscope, Clock, Search } from 'lucide-react';

export default function DoctorDashboard() {
  const [tab, setTab] = useState('overview'); // overview | schedule | patients | messages
  const [isLoading, setIsLoading] = useState(true);

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Mock data — replace with real fetch using token
      setDoctor({
        id: 'D10021',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        email: 'sarah.johnson@hospital.com'
      });

      setAppointments([
        { id: 'ap1', patient: 'John Doe', date: todayISO(), time: '09:00 AM', reason: 'Follow-up', status: 'Confirmed', room: '402' },
        { id: 'ap2', patient: 'Mary Smith', date: todayISO(), time: '10:00 AM', reason: 'ECG Review', status: 'Confirmed', room: '402' },
        { id: 'ap3', patient: 'Amit Verma', date: todayISO(), time: '11:30 AM', reason: 'Chest Pain', status: 'Pending', room: '403' },
        { id: 'ap4', patient: 'Lina Park', date: addDaysISO(1), time: '02:00 PM', reason: 'BP Check', status: 'Confirmed', room: '305' },
      ]);

      setPatients([
        { id: 'p1', name: 'John Doe', lastVisit: '2025-07-28', conditions: ['Hypertension'] },
        { id: 'p2', name: 'Mary Smith', lastVisit: '2025-07-20', conditions: ['Arrhythmia'] },
        { id: 'p3', name: 'Amit Verma', lastVisit: '2025-06-30', conditions: ['Chest pain'] },
      ]);

      setMessages([
        { id: 'm1', from: 'Reception', text: 'New patient added to your list', time: '1h' },
        { id: 'm2', from: 'Lab', text: 'Report ready for John Doe', time: '3h' },
      ]);

      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const todayCount = appointments.filter(a => a.date === todayISO()).length;
    const pending = appointments.filter(a => a.status === 'Pending').length;
    return [
      { id: 's1', icon: <CalendarDays size={22} />, label: 'Today’s Appointments', value: todayCount },
      { id: 's2', icon: <ClipboardList size={22} />, label: 'Pending Cases', value: pending },
      { id: 's3', icon: <User size={22} />, label: 'Active Patients', value: patients.length },
      { id: 's4', icon: <Stethoscope size={22} />, label: 'Doctor ID', value: doctor?.id || '—' },
    ];
  }, [appointments, patients, doctor]);

  const statusClasses = (status) =>
    status === 'Confirmed'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'Pending'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-slate-100 text-slate-700';

  const handleMarkComplete = (id) => {
    // TODO: PUT /api/doctor/appointments/:id/complete
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Completed' } : a));
  };

  const handleReschedule = (id) => {
    // TODO: open modal → PUT /api/doctor/appointments/:id/reschedule
    alert(`Reschedule appointment ${id} (modal placeholder)`);
  };

  const handleSendMessage = () => {
    // TODO: POST /api/messages
    alert('Send message (placeholder)');
  };

  return (
    <div className="min-h-screen bg-[#f8feff] text-slate-800 antialiased">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Doctor Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome, <span className="font-semibold">{doctor?.name || '—'}</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-xs text-slate-400">{doctor?.specialty || '—'}</span>
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border">
            <div className="h-9 w-9 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">
              {doctor?.name ? doctor.name.split(' ').map(n => n[0]).join('') : 'DR'}
            </div>
            <div>
              <p className="text-sm font-medium">{doctor?.name || '—'}</p>
              <p className="text-xs text-slate-400">{doctor?.email || '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-100 shadow-sm">
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

          <div className="grid grid-cols-4 w-full bg-sky-50 rounded-md overflow-hidden border border-slate-200 mb-5">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'schedule', label: 'Schedule' },
              { key: 'patients', label: 'Patients' },
              { key: 'messages', label: 'Messages' },
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
            <div className="py-16 flex items-center justify-center text-slate-400">Loading doctor view…</div>
          ) : (
            <>
              {tab === 'overview' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Next Patient</h3>
                    {appointments[0] ? (
                      <div>
                        <p className="font-semibold">{appointments[0].patient}</p>
                        <p className="text-xs text-slate-400">{appointments[0].reason}</p>
                        <p className="text-sm text-slate-600 mt-1">
                          {formatDate(appointments[0].date)} • {appointments[0].time} • Room {appointments[0].room}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button className="text-xs text-sky-600" onClick={() => handleMarkComplete(appointments[0].id)}>Mark Complete</button>
                          <button className="text-xs text-slate-600" onClick={() => handleReschedule(appointments[0].id)}>Reschedule</button>
                        </div>
                      </div>
                    ) : <p className="text-sm text-slate-500">No appointments.</p>}
                  </div>

                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Today’s Schedule</h3>
                    <ul className="space-y-2 text-sm">
                      {appointments.filter(a => a.date === todayISO()).map(a => (
                        <li key={a.id} className="flex items-center justify-between bg-white border rounded-md p-2">
                          <div>
                            <p className="font-medium">{a.patient}</p>
                            <p className="text-xs text-slate-500">{a.time} • {a.reason}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusClasses(a.status)}`}>{a.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-b from-white to-slate-50 border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <CalendarDays size={16} /> New Slot
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <ClipboardList size={16} /> Add Notes
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm" onClick={handleSendMessage}>
                        <MessageSquare size={16} /> Message
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border hover:shadow-sm">
                        <User size={16} /> New Patient
                      </button>
                    </div>
                  </div>

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

              {tab === 'schedule' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} />
                    <h3 className="text-sm font-semibold">Manage Schedule</h3>
                  </div>
                  <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Add or block time slots, set availability (placeholder UI).</p>
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-2 rounded-md bg-sky-500 text-white">+ Add Slot</button>
                      <button className="px-3 py-2 rounded-md border">Block Time</button>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'patients' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User size={16} />
                    <h3 className="text-sm font-semibold">Patients</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-2 bg-white border rounded-md px-3 py-2 w-full md:w-80">
                      <Search size={16} />
                      <input className="outline-none text-sm w-full" placeholder="Search patient…" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {patients.map(p => (
                      <div key={p.id} className="bg-white border rounded-xl p-3 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-slate-500">Last visit: {formatDate(p.lastVisit)}</p>
                          <p className="text-xs text-slate-500">Conditions: {p.conditions.join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-sky-600">View Records</button>
                          <button className="text-xs text-slate-600">Add Note</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'messages' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={16} />
                    <h3 className="text-sm font-semibold">Messages</h3>
                  </div>
                  <div className="space-y-2">
                    {messages.map(m => (
                      <div key={m.id} className="bg-white border rounded-xl p-3 shadow-sm">
                        <p className="text-sm"><span className="font-medium">{m.from}:</span> {m.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{m.time} ago</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input className="border rounded-md px-3 py-2 text-sm flex-1" placeholder="Type a message…" />
                    <button className="px-3 py-2 rounded-md bg-sky-500 text-white" onClick={handleSendMessage}>Send</button>
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
