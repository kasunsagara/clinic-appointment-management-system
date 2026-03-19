import { useState, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { BsGraphUp, BsCalendar } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";
import ManageAppointmentsPage from "./doctor/manageAppointmentsPage";
import { toast } from "react-hot-toast";
import api from "../services/api";

export default function DoctorHomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = async () => {
    try {
      await api.post(
        "/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
          <h1 className="text-2xl font-extrabold mb-10 flex flex-col gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              ClinicCare
            </span>
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold w-fit">
              DOCTOR PANEL
            </span>
          </h1>

          <div className="flex flex-col gap-3">
            <Link
              to="/doctor/dashboard"
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500 hover:text-white transition-all shadow-sm hover:shadow-md"
            >
              <BsGraphUp size={20} />
              Dashboard
            </Link>

            <Link
              to="/doctor/appointments"
              className="flex items-center gap-3 p-3 rounded-xl font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-500 hover:text-white transition-all shadow-sm hover:shadow-md"
            >
              <BsCalendar size={20} />
              Appointments
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
                <h1 className="text-6xl font-extrabold text-gray-800 mb-4">
                  {user ? `Welcome Doctor, ${user.name}` : "Welcome Doctor"}
                </h1>
                <p className="text-gray-500 text-2xl">
                  Manage your appointments and patients efficiently from your dashboard.
                </p>
              </div>
            }
          />

          <Route
            path="/dashboard"
            element={
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-700">
                  {user ? `Doctor ${user.name} Dashboard` : "Doctor Dashboard"}
                </h1>
              </div>
            }
          />

          <Route path="/appointments" element={<ManageAppointmentsPage />} />

          <Route
            path="*"
            element={
              <h1 className="text-3xl font-bold text-red-500">Doctor 404 Error</h1>
            }
          />
        </Routes>
      </div>
    </div>
  );
}