import { useState, useEffect } from "react";

export default function ParentAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  // Load appointments from localStorage or API (for demo, we use dummy data)
  useEffect(() => {
    // Replace this with actual API call to fetch doctor-specific appointments
    const savedAppointments = [
      { id: 1, patientName: "John Doe", date: "2026-03-18", time: "10:00 AM" },
      { id: 2, patientName: "Jane Smith", date: "2026-03-18", time: "11:30 AM" },
      { id: 3, patientName: "Bob Johnson", date: "2026-03-19", time: "09:00 AM" },
    ];
    setAppointments(savedAppointments);
  }, []);

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Parent Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-lg">No appointments scheduled.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800">{appt.patientName}</h2>
              <p className="text-gray-600">Date: {appt.date}</p>
              <p className="text-gray-600">Time: {appt.time}</p>
              <button className="mt-3 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}