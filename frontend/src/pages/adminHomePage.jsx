import { useState, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { BsGraphUp, BsPeople, BsCalendar, BsPerson } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../services/api";
import ManageDoctorsPage from "./admin/manageDoctorsPage";
import AddDoctorPage from "./admin/addDoctorPage";
import UpdateDoctorPage from "./admin/updateDoctorPage";
import ManageUsersPage from "./admin/manageUsersPage";
import AddAdminPage from "./admin/addAdminPage";
import ViewAppointmentsPage from "./admin/viewAppointmentsPage";

export default function AdminHomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-teal-50 relative overflow-hidden">

      {/* Sidebar */}
      <div className="w-[18%] bg-white shadow-xl p-6 flex flex-col justify-between h-screen fixed z-10">

        {/* Top: Logo + Menu Items */}
        <div>
          {/* Logo */}
          <h1 className="text-2xl font-extrabold mb-10 flex flex-col gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              ClinicCare
            </span>
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold w-fit">
              ADMIN PANEL
            </span>
          </h1>

          {/* Menu Items */}
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500 hover:text-white transition-all shadow-sm hover:shadow-md"
            >
              <BsGraphUp size={20} />
              Dashboard
            </Link>

            <Link
              to="/admin/doctors"
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500 hover:text-white transition-all shadow-sm hover:shadow-md"
            >
              <BsPeople size={20} />
              Doctors
            </Link>

            <Link
              to="/admin/appointments"
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500 hover:text-white transition-all shadow-sm hover:shadow-md"
            >
              <BsCalendar size={20} />
              Appointments
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500 hover:text-white transition-all shadow-sm hover:shadow-md"
            >
              <BsPerson size={20} />
              Users
            </Link>
          </div>
        </div>

        {/* Bottom: Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl font-medium text-red-600 hover:bg-red-100 hover:text-red-700 transition-all shadow-sm hover:shadow-md w-full"
        >
          <FaSignOutAlt size={20} />
          Logout
        </button>

      </div>

      {/* Main Content */}
      <div className="w-[82%] p-10 overflow-y-auto z-10 ml-[18%]">

        <Routes>

          <Route
            path="/"
            element={
              <div className="p-48 text-center">
                <h1 className="text-6xl font-extrabold text-gray-800 mb-2">
                  {user ? `Welcome Back, ${user.name}` : "Welcome to Admin Panel"}
                </h1>

                <p className="text-gray-500 text-2xl">
                  Manage doctors, appointments and users easily from your dashboard.
                </p>
              </div>
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-700">
                  Manage Dashboard
                </h1>
              </div>
            }
          />

          {/* Doctors */}
          <Route path="/doctors" element={<ManageDoctorsPage />} />
          <Route path="/doctors/add-doctor" element={<AddDoctorPage />} />
          <Route path="/doctors/update-doctor/:id" element={<UpdateDoctorPage />} />

          {/* Appointments */}
          <Route path="/appointments" element={<ViewAppointmentsPage />} />

          {/* Users */}
          <Route path="/users" element={<ManageUsersPage />} />
          <Route path="/users/add-admin" element={<AddAdminPage />} />

        </Routes>

      </div>
    </div>
  );
}