
export default function OnlineServices() {
  const services = [
    {
      name: "Book Appointments",
      description: "Schedule consultations with your preferred doctor anytime.",
      icon: "📅",
    },
    {
      name: "Online Consultations",
      description: "Connect with doctors via secure video calls from your home.",
      icon: "💻",
    },
    {
      name: "Prescription Refills",
      description: "Request medication refills without visiting the hospital.",
      icon: "💊",
    },
    {
      name: "Lab Report Downloads",
      description: "Access and download your medical test results instantly.",
      icon: "🧪",
    },
    {
      name: "Billing & Payments",
      description: "Pay hospital bills securely online via multiple payment modes.",
      icon: "💳",
    },
  ];

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-hospitalBlue mb-3">Online Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access our healthcare services from the comfort of your home. Our
          online tools make it easy to stay healthy and connected.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-5xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold text-hospitalBlue mb-2">
              {service.name}
            </h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
