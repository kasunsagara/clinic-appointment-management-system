import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import api from "../../services/api";

export default function ManageDoctorsPage() {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Decode token safely
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = token.split(".")[1];
        if (payload) {
          const decoded = JSON.parse(atob(payload));
          setUser(decoded.user || null);
        }
      } catch (err) {
        console.error("Token decode failed:", err);
        setUser(null);
      }
    }
  }, []);

  // Fetch doctors from backend
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await api.get("/doctors");
      setDoctors(response.data.list || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Toggle Active / Deactivate
  const handleToggleStatus = async (id) => {
    try {
      const response = await api.put(`/doctors/${id}/status`);
      toast.success(response.data.message);
      fetchDoctors();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  // Delete doctor permanently
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/doctors/${id}`);
      toast.success(response.data.message || "Doctor deleted");
      fetchDoctors();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete doctor");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Doctors
          </h1>
          <button
            onClick={() => navigate("/admin/doctors/add-doctor")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm"
          >
            <FaPlus /> Add New Doctor
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Doctors Found</h3>
            <p className="text-gray-500">There are no doctors in the system.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">

                {/* Table Head */}
                <thead>
                  <tr className="bg-gray-100 text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Doctor</th>
                    <th className="p-4 font-semibold">Specialization</th>
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
                  {doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-50">

                      {/* Doctor Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              doctor.profilePicture ||
                              "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg"
                            }
                            alt="doctor"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold">Dr. {doctor.userId?.name || "Unknown"}</p>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {doctor.specialization || "N/A"}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="p-4">
                        <p className="text-sm font-medium">{doctor.userId?.phone || "-"}</p>
                        <p className="text-xs text-gray-500">{doctor.userId?.email || "-"}</p>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {doctor.isActive ? (
                          <span className="text-green-600 font-semibold text-sm flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Active
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold text-sm flex items-center gap-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">

                          {/* Toggle Button */}
                          <button
                            onClick={() => handleToggleStatus(doctor._id)}
                            className={`px-3 py-1 rounded text-white text-xs font-medium ${
                              doctor.isActive
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {doctor.isActive ? "Deactivate" : "Activate"}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(doctor._id)}
                            className="px-3 py-1 rounded text-white text-xs font-medium bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </button>

                        </div>
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