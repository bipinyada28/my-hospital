import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaFileMedical, FaCalendarCheck, FaUserMd, FaStethoscope } from 'react-icons/fa';

const PatientDashboard = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const [user, setUser] = useState({ name: 'John Doe' }); // Dummy user name
  const [appointments, setAppointments] = useState([
    { date: '2025-08-12', doctor: 'Dr. Priya Sharma', status: 'Upcoming' },
    { date: '2025-07-15', doctor: 'Dr. Ramesh B.', status: 'Completed' },
  ]);
  const [reports, setReports] = useState([
    { title: 'Blood Test Report', date: '2025-07-10' },
    { title: 'MRI Scan', date: '2025-06-25' },
  ]);

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-800 mb-1" data-aos="fade-down">
          Welcome, {user.name} 👋
        </h2>
        <p className="text-gray-600 mb-10" data-aos="fade-down" data-aos-delay="100">
          Here's your health dashboard.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard
            title="Reports"
            value={reports.length}
            icon={<FaFileMedical size={28} />}
            bg="bg-gradient-to-r from-purple-500 to-purple-700"
            delay={200}
          />
          <SummaryCard
            title="Appointments"
            value={appointments.length}
            icon={<FaCalendarCheck size={28} />}
            bg="bg-gradient-to-r from-green-500 to-green-700"
            delay={300}
          />
          <SummaryCard
            title="Doctors"
            value="4"
            icon={<FaUserMd size={28} />}
            bg="bg-gradient-to-r from-blue-500 to-blue-700"
            delay={400}
          />
          <SummaryCard
            title="Consultations"
            value="2 pending"
            icon={<FaStethoscope size={28} />}
            bg="bg-gradient-to-r from-rose-500 to-rose-700"
            delay={500}
          />
        </div>

        {/* Appointments */}
        <section className="mb-10" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Your Appointments</h3>
          {appointments.length ? (
            <div className="space-y-4">
              {appointments.map((a, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">
                      {a.date} — {a.doctor}
                    </p>
                    <p className="text-sm text-gray-500">Status: {a.status}</p>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    a.status === 'Upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <NoDataMessage text="No appointments booked yet.">
              <a
                href="/book"
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mt-2 inline-block"
              >
                Book Now
              </a>
            </NoDataMessage>
          )}
        </section>

        {/* Medical Reports */}
        <section data-aos="fade-up" data-aos-delay="300">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Medical Reports</h3>
          {reports.length ? (
            <div className="space-y-4">
              {reports.map((r, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <p className="font-medium text-gray-800">{r.title}</p>
                  <span className="text-sm text-gray-500">{r.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <NoDataMessage text="No reports uploaded yet. Check back later!" />
          )}
        </section>
      </div>
    </div>
  );
};

// Summary card component
const SummaryCard = ({ title, value, icon, bg, delay }) => (
  <div
    className={`rounded-lg p-6 text-white shadow-md ${bg}`}
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div className="flex items-center gap-4">
      <div className="bg-white bg-opacity-20 p-3 rounded-full">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

// No data fallback
const NoDataMessage = ({ text, children }) => (
  <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded text-center">
    <p>{text}</p>
    {children}
  </div>
);

export default PatientDashboard;
