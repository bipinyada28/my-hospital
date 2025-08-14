export default function Departments() {
  const departments = [
    {
      name: "Cardiology",
      description: "Heart checkups, treatments, and surgeries by expert cardiologists.",
      image: "/assets/doc1.jpeg",
    },
    {
      name: "Neurology",
      description: "Advanced care for brain and nervous system disorders.",
      image: "/assets/doc2.jpeg",
    },
    {
      name: "Orthopedics",
      description: "Bone, joint, and spine treatments for all ages.",
      image: "/assets/doc3.jpeg",
    },
    {
      name: "Pediatrics",
      description: "Comprehensive healthcare for infants, children, and adolescents.",
      image: "/assets/hospital.jpg",
    },
    {
      name: "Dermatology",
      description: "Skin care treatments and cosmetic dermatology services.",
      image: "/assets/hospital2.jpg",
    },
  ];

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-hospitalBlue mb-3">Our Departments</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We offer world-class medical care across multiple specialties, with experienced doctors
          and cutting-edge technology.
        </p>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={dept.image}
              alt={dept.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-hospitalBlue mb-2">{dept.name}</h3>
              <p className="text-gray-600">{dept.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
