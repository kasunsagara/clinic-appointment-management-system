import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/users/login", formData);

      const { token, user } = response.data;

      toast.success("Login successful");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // redirect by role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/doctors");
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">

        <div className="bg-blue-600 py-6 px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-blue-100 text-sm">Sign in to your account</p>
        </div>

        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative mt-1">
                <div className="absolute left-3 top-3 text-gray-400">
                  <FaEnvelope />
                </div>

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="pl-10 w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-1">
                <div className="absolute left-3 top-3 text-gray-400">
                  <FaLock />
                </div>

                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="pl-10 w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-sm text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}