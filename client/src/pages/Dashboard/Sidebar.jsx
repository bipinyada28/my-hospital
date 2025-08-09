import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { key: "overview", label: "Overview", icon: "🏠" },
    { key: "appointments", label: "Appointments", icon: "📅" },
    { key: "records", label: "Medical Records", icon: "📂" },
    { key: "profile", label: "Update Profile", icon: "✏️" },
  ];

  return (
    <aside className="w-64 bg-primary text-white flex flex-col py-6 shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Patient Panel</h2>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`w-full text-left px-6 py-3 flex items-center space-x-3 hover:bg-blue-800 ${
              activeTab === item.key ? "bg-blue-800" : ""
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
