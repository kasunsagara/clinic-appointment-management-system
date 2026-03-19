import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function MyAppointmentsPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await api.get("/appointments");
        if (response.data.list) {
          setAppointments(response.data.list);
        }
      } catch (error) {
        toast.error("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs">Approved</span>;
      case "pending":
        return <span className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-xs">Pending</span>;
      case "completed":
        return <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">Completed</span>;
      case "cancelled":
        return <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Track your booked appointments</p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments Found</h3>
            <p className="text-gray-500 mb-6">You haven't booked any appointments yet.</p>
            <button
              onClick={() => navigate("/doctors")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-500 border-b border-gray-100 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">ID / Date / Time</th>
                    <th className="p-4 font-semibold">Doctor</th>
                    <th className="p-4 font-semibold">Specialization</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Note</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {appointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-gray-50">

                      <td className="p-4 whitespace-nowrap">
                        <p className="font-mono text-xs text-gray-500 mb-1">
                          {apt.appointmentId}
                        </p>
                        <p className="font-semibold text-gray-900">{apt.date}</p>
                        <p className="text-sm text-gray-600">{apt.time}</p>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <p className="font-bold text-gray-900">
                          Dr. {apt.doctorId?.userId?.name || "Unknown"}
                        </p>
                      </td>

                      <td className="p-4 whitespace-nowrap text-sm text-gray-600">
                        {apt.doctorId?.specialization || "N/A"}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {getStatusBadge(apt.status)}
                      </td>

                      <td className="p-4 text-sm text-gray-600">
                        {apt.note || (
                          <span className="text-gray-400 italic">No note</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}