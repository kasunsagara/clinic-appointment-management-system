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
        const response = await api.get("/appointments"); // user-specific endpoint
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
  }, [navigate, user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">Approved</span>;
      case "pending":
        return <span className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">Pending</span>;
      case "completed":
        return <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">Completed</span>;
      case "cancelled":
        return <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
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
                    <th className="p-4 font-semibold whitespace-nowrap">Appoinment ID</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Appointment Number</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Date / Time</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Doctor</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Specialization</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Patient Details</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {appointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-gray-50 transition-colors">

                      {/* ID */}
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-mono text-xs font-bold text-gray-500">{apt.appointmentId}</p>
                      </td>

                      {/* Appointment Number */}  
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-mono text-xs font-bold text-gray-500">{apt.appointmentNumber || "N/A"}</p>
                      </td>

                      {/* Date / Time */}
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-semibold text-gray-900">{apt.date}</p>
                        <p className="text-sm text-gray-600">{apt.time}</p>
                      </td>

                      {/* Doctor */}
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-bold text-gray-900">
                          Dr. {apt.doctorId?.userId?.name || "Unknown"}
                        </p>
                      </td>

                      {/* Specialization */}
                      <td className="p-4 whitespace-nowrap text-sm text-gray-600">
                        {apt.doctorId?.specialization || "N/A"}
                      </td>

                      {/* Patient Details */}
                      <td className="p-4 text-sm text-gray-600">
                        <p className="font-medium text-gray-600">Name: {apt.patient?.name || "N/A"}</p>
                        <p className="font-medium text-gray-600">Age: {apt.patient?.age || "N/A"}</p>
                        <p className="font-medium text-gray-600">Reason: {apt.patient?.reason || "No reason provided"}</p>
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">{getStatusBadge(apt.status)}</td>

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