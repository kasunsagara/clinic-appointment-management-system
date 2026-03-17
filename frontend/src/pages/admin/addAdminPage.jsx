import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";

export default function AddAdminPage() {
  const navigate = useNavigate();
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "admin",
  });

  const handleInputChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating admin account...");

    try {
      const response = await api.post("/users", newAdmin);
      if (response.data.message === "User created successfully") {
        toast.success(response.data.message, { id: toastId });
        navigate("/admin/users");
      } else {
        toast.error(response.data.message || "Failed to create admin", { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating admin", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Admin</h2>
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={newAdmin.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Admin Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={newAdmin.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@clinic.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              required
              value={newAdmin.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0773456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={newAdmin.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              minLength="6"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="px-5 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-sm transition-colors"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}