import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments assigned to the logged-in doctor
  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments"); // backend endpoint doctor-specific
      if (response.data.list) {
        setAppointments(response.data.list);
      }
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Update appointment status
  const updateStatus = async (appointmentId, status) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status });
      toast.success(`Appointment updated to ${status}`);
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId ? { ...apt, status } : apt
        )
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

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

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-3 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Appointments</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments Found</h3>
            <p className="text-gray-500">You currently have no appointments assigned.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 border-b border-gray-100 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold whitespace-nowrap">ID / Date / Time</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Patient</th>
                    <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                    <th className="p-4 font-semibold">Note</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-mono text-xs font-bold text-gray-500 mb-1">{apt.appointmentId}</p>
                        <p className="font-semibold text-gray-900">{apt.date}</p>
                        <p className="text-sm text-gray-600">{apt.time}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-bold text-gray-900">{apt.patientId?.name || "Unknown Patient"}</p>
                        <p className="text-xs text-gray-500">{apt.patientId?.phone || "N/A"}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap">{getStatusBadge(apt.status)}</td>
                      <td className="p-4 text-sm text-gray-600">{apt.note || <span className="text-gray-400 italic">No note</span>}</td>
                      <td className="p-4 whitespace-nowrap space-x-2 flex items-center">
                        {/* Show all 4 status buttons: Pending, Approve, Complete, Cancel */}
                        <button
                          onClick={() => updateStatus(apt._id, "pending")}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            apt.status === "pending" ? "bg-yellow-500 text-white" : "bg-yellow-500 text-white hover:bg-yellow-600"
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => updateStatus(apt._id, "approved")}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            apt.status === "approved" ? "bg-green-500 text-white" : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(apt._id, "completed")}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            apt.status === "completed" ? "bg-blue-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateStatus(apt._id, "cancelled")}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            apt.status === "cancelled" ? "bg-red-500 text-white" : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                        >
                          Cancel
                        </button>
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