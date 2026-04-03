import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaCalendarCheck, FaUserCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../services/api";

export default function Header() {

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  // Load user from localStorage
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
    <header className="bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">

              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
                C
              </div>

              <span className="font-bold text-xl text-gray-800 tracking-tight">
                ClinicCare
              </span>

            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">

            <Link
              to="/doctors"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Doctors
            </Link>

            {!user ? (

              <div className="flex space-x-4">

                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  Register
                </Link>

              </div>

            ) : (

              <div className="flex items-center space-x-4">

                <Link
                  to="/my-appointments"
                  className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
                >
                  <FaCalendarCheck />
                  My Appointments
                </Link>

                {/* User dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >

                  <button
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                  >
                    <FaUserCircle className="text-[20px]" />
                    <span className="font-medium">{user?.name}</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full w-48 bg-white rounded-md shadow-xl py-1 z-10 border border-gray-100">

                      <Link
                        to="/my-account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Account
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>

                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      </div>

    </header>
  );
}