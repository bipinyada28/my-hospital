import React from 'react';
import {
  CalendarDays,
  FileText,
  Heart,
  User,
  Bell,
  Download,
  Phone,
  Cloud,
  Activity,
  Droplet,
  Salad,
  Bed,
  Smile,
  ShieldCheck,
} from 'lucide-react';

/**
 * HealthFirst.jsx
 *
 * This component provides a static, UI-only page for health tips.
 * It has been updated to match the UI style of the Departments page.
 */
export default function HealthFirst() {
  const tips = [
    {
      id: 1,
      title: 'Stay Hydrated',
      icon: <Droplet size={24} className="text-blue-500" />,
      description: 'Drink at least 8 glasses of water a day. Staying hydrated boosts energy, supports skin health, and aids digestion.',
    },
    {
      id: 2,
      title: 'Eat a Balanced Diet',
      icon: <Salad size={24} className="text-green-500" />,
      description: 'Incorporate a variety of fruits, vegetables, lean proteins, and whole grains into your meals. A balanced diet is key to a healthy body.',
    },
    {
      id: 3,
      title: 'Get Regular Exercise',
      icon: <Activity size={24} className="text-rose-500" />,
      description: 'Aim for at least 30 minutes of moderate exercise most days of the week. Physical activity improves cardiovascular health and mood.',
    },
    {
      id: 4,
      title: 'Prioritize Sleep',
      icon: <Bed size={24} className="text-indigo-500" />,
      description: 'Target 7-9 hours of quality sleep per night. Proper rest is essential for mental clarity, physical recovery, and a strong immune system.',
    },
    {
      id: 5,
      title: 'Manage Stress',
      icon: <Smile size={24} className="text-amber-500" />,
      description: 'Practice mindfulness, meditation, or hobbies to reduce stress levels. Chronic stress can negatively impact both physical and mental health.',
    },
    {
      id: 6,
      title: 'Regular Check-ups',
      icon: <ShieldCheck size={24} className="text-teal-500" />,
      description: 'Don\'t skip your annual health screenings. Regular check-ups can help detect and prevent health issues early on.',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-gray-50 to-white text-center py-20 px-6 sm:px-10">
        <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
          Your Daily Well-being
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mt-2 mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent leading-tight">
          Essential Health Tips for a Better Life
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Small changes can lead to big results. Follow these simple tips to improve your physical and mental health.
        </p>
      </div>

      {/* Tips Grid */}
      <div className="container mx-auto py-16 px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-3xl p-8 flex flex-col items-start shadow-sm border border-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              <div className="bg-gray-100 p-4 rounded-full shadow-inner">
                {tip.icon}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mt-6">
                {tip.title}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}