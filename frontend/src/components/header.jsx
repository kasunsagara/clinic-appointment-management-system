import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaCalendarCheck } from "react-icons/fa";

export default function Header() {
  // Start with no user
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null); // clear user
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/my-appointments"
                    className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
                  >
                    <FaCalendarCheck />
                    <span>My Appointments</span>
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 focus:outline-none">
                    <FaUserCircle className="text-2xl" />
                    <span className="font-medium">{user.name}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-xl py-1 z-10 hidden group-hover:block border border-gray-100">
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};