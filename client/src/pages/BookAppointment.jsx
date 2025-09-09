import React, { useEffect, useState } from 'react';
import {
  FaUser,
  FaHeartbeat,
  FaCalendarAlt,
  FaCheckCircle,
} from 'react-icons/fa';

const steps = [
  { id: 1, label: 'Personal Info', icon: <FaUser /> },
  { id: 2, label: 'Department', icon: <FaHeartbeat /> },
  { id: 3, label: 'Date & Time', icon: <FaCalendarAlt /> },
  { id: 4, label: 'Review', icon: <FaCheckCircle /> },
];

const Appointment = () => {
  const [step, setStep] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    insurance: '',
    department: '',
    doctor: '',
    reason: '',
    date: '',
    time: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  
  // NEW: State for departments and doctors
  const [departments, setDepartments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle step navigation
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const validateStep = () => {
    if (step === 1) {
      return (
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone
      );
    }
    if (step === 2) {
      return (
        formData.department &&
        formData.doctor &&
        formData.reason
      );
    }
    if (step === 3) {
      return formData.date && formData.time;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    } else {
      alert('Please fill all required fields (*) before continuing.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setStep(4); // Show confirmation
      } else {
        alert(data.message || 'Something went wrong!');
      }
    } catch (err) {
      alert('Failed to book appointment!');
      console.error(err);
    }
  };


  const handleAddToCalendar = () => {
    const title = encodeURIComponent('Appointment with ' + formData.doctor);
    const details = encodeURIComponent(
      `Department: ${formData.department}\nPatient: ${formData.firstName} ${formData.lastName}`
    );
    const location = encodeURIComponent('True Heal Hospital');
    const startDate =
      formData.date.replace(/-/g, '') +
      'T' +
      formData.time.replace(':', '') +
      '00Z';

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${startDate}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // NEW: Fetch departments & doctors on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data));

    fetch("http://localhost:5000/api/public/doctors")
      .then((res) => res.json())
      .then((data) => setDoctorsList(data));
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen p-4">
      {/* Top Header */}
      <div className="bg-blue-600 text-white rounded-lg py-6 px-4 text-center shadow-md mb-6">
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
        <p className="mt-2">Fast, easy, and secure online booking with our doctors.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center items-center mb-8 space-x-4 text-sm">
        {steps.map((s, idx) => (
          <div
            key={s.id}
            className={`flex items-center space-x-2 ${
              step === s.id ? 'text-blue-600 font-semibold' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{s.icon}</span>
            {!isMobile && <span>{s.label}</span>}
            {idx < steps.length - 1 && <span className="w-6 border-b border-gray-300 mx-2"></span>}
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-blue-100 max-w-4xl mx-auto rounded-lg shadow p-6 md:p-10">
        <p className="text-sm text-gray-600 mb-4">
          <span className="text-red-500 font-bold">*</span> Required fields
        </p>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>First Name <span className="text-red-500">*</span></label>
                <input autoFocus required name="firstName" onChange={handleChange} value={formData.firstName} className="input" />
              </div>
              <div>
                <label>Last Name <span className="text-red-500">*</span></label>
                <input required name="lastName" onChange={handleChange} value={formData.lastName} className="input" />
              </div>
              <div>
                <label>Email <span className="text-red-500">*</span></label>
                <input required type="email" name="email" onChange={handleChange} value={formData.email} className="input" />
              </div>
              <div>
                <label>Phone <span className="text-red-500">*</span></label>
                <input required name="phone" maxLength={10} pattern="[0-9]{10}" onChange={handleChange} value={formData.phone} className="input" />
              </div>
              <div>
                <label>Date of Birth</label>
                <input type="date" name="dob" onChange={handleChange} value={formData.dob} className="input" />
              </div>
              <div>
                <label>Insurance Provider</label>
                <input name="insurance" onChange={handleChange} value={formData.insurance} className="input" />
              </div>
            </div>
            <div className="text-right mt-6">
              <button onClick={handleNext} className="btn-primary">Next</button>
            </div>
          </>
        )}

        {/* Step 2: Department */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Department & Doctor</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label>Department <span className="text-red-500">*</span></label>
                <select
                  name="department"
                  required
                  onChange={handleChange}
                  value={formData.department}
                  className="input"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Doctor <span className="text-red-500">*</span></label>
                <select
                  name="doctor"
                  required
                  onChange={handleChange}
                  value={formData.doctor}
                  className="input"
                >
                  <option value="">Select Doctor</option>
                  {doctorsList
                    .filter((doc) => doc.department === formData.department)
                    .map((doc) => (
                      <option key={doc._id} value={doc.name}>
                        Dr. {doc.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label>Reason for Visit <span className="text-red-500">*</span></label>
                <textarea
                  name="reason"
                  required
                  onChange={handleChange}
                  value={formData.reason}
                  className="input"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="btn-secondary">Previous</button>
              <button onClick={handleNext} className="btn-primary">Next</button>
            </div>
          </>
        )}

        {/* Step 3: Date and Time */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Schedule Appointment</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label>Date <span className="text-red-500">*</span></label>
                <input  type="date" required  name="date"  min={new Date().toISOString().split("T")[0]} onChange={handleChange}
                value={formData.date} className="input"/>
              </div>
              <div>
                <label>Time <span className="text-red-500">*</span></label>
                <select name="time" required onChange={handleChange} value={formData.time} className="input">
                  <option value="">Select Time</option>
                  <option>9:00 AM</option>
                  <option>11:00 AM</option>
                  <option>2:00 PM</option>
                </select>
              </div>
              <div>
                <label>Additional Notes</label>
                <textarea name="notes" onChange={handleChange} value={formData.notes} className="input" />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="btn-secondary">Previous</button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`btn-primary ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Booking...' : 'Submit'}
              </button>
            </div>
          </>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="text-center">
            <FaCheckCircle className="text-green-500 text-5xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold mb-2">Appointment Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              A confirmation has been sent to <strong>{formData.email}</strong>.
            </p>
            <div className="bg-white p-4 rounded-md inline-block text-left">
              <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
              <p><strong>Doctor:</strong> {formData.doctor}</p>
              <p><strong>Department:</strong> {formData.department}</p>
              <p><strong>Date & Time:</strong> {formData.date} at {formData.time}</p>
            </div>
            <div className="mt-6 space-x-4">
              <button className="btn-primary" onClick={handleAddToCalendar}>Add to Calendar</button>
              <button className="btn-secondary" onClick={() => setStep(1)}>Book Another</button>
            </div>
          </div>
        )}
      </div>
      {/* Support Section */}
      <div className="mt-12 bg-white shadow rounded p-6 text-center max-w-xl mx-auto">
        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p className="text-gray-600 mb-4">Contact us directly from here.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="tel:+911234567890">
            <button className="btn-secondary flex items-center gap-2">
              📞 Call Us
            </button>
          </a>
          <a href="mailto:support@trueheal.com?subject=Appointment%20Support">
            <button className="btn-secondary flex items-center gap-2">
              📧 Email Us
            </button>
          </a>
        </div>
      </div>

    </div>
  );
};

export default Appointment;