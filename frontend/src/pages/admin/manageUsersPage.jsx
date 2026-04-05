import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import api from "../../services/api";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      if (response.data.list) setUsers(response.data.list);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      toast.success(response.data.message || "User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
          </div>
          <button
            onClick={() => navigate("/admin/users/add-admin")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <FaPlus /> Add New Admin
          </button>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Users Found</h3>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">User Name</th>
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{u.name}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-gray-800">{u.phone}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "doctor"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 flex justify-end">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="px-2 py-1 rounded text-white text-xs font-medium  bg-red-500 hover:bg-red-600"
                        >
                          Delete
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