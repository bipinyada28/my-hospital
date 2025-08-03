import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { registerUser, loginUser } from "../services/authService";


export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let response;
    if (activeTab === "login") {
      response = await loginUser(formData);
    } else {
      response = await registerUser(formData);
    }

    console.log("Server Response:", response);

    if (response.token) {
      localStorage.setItem("token", response.token);
      alert("✅ Success!");
    } else {
      alert(response.message || "Something went wrong.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("🚨 Server error. See console.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">
          Access your healthcare account
        </p>

        {/* Tab Switch */}
        <div className="flex bg-blue-50 rounded-full overflow-hidden mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`w-1/2 py-2 font-medium transition-all duration-300 ${
              activeTab === "login"
                ? "bg-white text-blue-500 shadow"
                : "text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`w-1/2 py-2 font-medium transition-all duration-300 ${
              activeTab === "register"
                ? "bg-white text-blue-500 shadow"
                : "text-gray-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FaUser /> {activeTab === "login" ? "Login" : "Register"}
          </div>

          {activeTab === "register" && (
            <div className="flex gap-2">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="input"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
          />

          <input
            type="password"
            name="password"
            placeholder={
              activeTab === "login" ? "Enter your password" : "Create a password"
            }
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded"
          >
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </button>

          {activeTab === "login" && (
            <button
              type="button"
              className="w-full py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Forgot Password?
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
