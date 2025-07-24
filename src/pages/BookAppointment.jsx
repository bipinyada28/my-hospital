import { useState } from 'react';
import axios from 'axios';

export default function BookAppointment() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',       // ✅ Added
    department: '',
    doctor: '',
    date: '',
    message: ''      // ✅ Added
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send only the required fields to backend
      const appointmentData = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        department: form.department,
        date: form.date,
        message: form.message
      };

      await axios.post('http://localhost:5000/api/appointments', appointmentData);
      setMessage('✅ Appointment Booked!');
      setForm({
        name: '',
        age: '',
        gender: '',
        email: '',
        phone: '',
        department: '',
        doctor: '',
        date: '',
        message: ''
      });
    } catch (err) {
      console.error('❌ Error:', err.response?.data || err.message);
      setMessage('❌ Error booking appointment');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-4">Book an Appointment</h2>
      {message && <p className="text-center mb-2 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="border p-2 rounded" />
        <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} required className="border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="border p-2 rounded" /> {/* ✅ Added */}
        <input type="text" name="department" placeholder="Department" value={form.department} onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="doctor" placeholder="Preferred Doctor" value={form.doctor} onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="date" value={form.date} onChange={handleChange} required className="border p-2 rounded" />
        <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} className="border p-2 rounded" rows={3} /> {/* ✅ Added */}
        <button type="submit" className="bg-primary text-white py-2 rounded hover:bg-opacity-90">Submit</button>
      </form>
    </div>
  );
}
