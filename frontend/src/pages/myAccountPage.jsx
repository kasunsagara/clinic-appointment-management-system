// pages/MyAccountPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

export default function MyAccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser?.email) {
          toast.error("User not logged in");
          setLoading(false);
          return;
        }

        const res = await api.get(`/users/me?email=${storedUser.email}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(res.data.user);
      } catch (error) {
        console.error("AxiosError", error);
        toast.error(
          error.response?.data?.message || "Failed to load account details"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-500">
        User not found or not logged in
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      {/* Single Big Card */}
      <div className="max-w-3xl mx-auto px-16">
        <div className="rounded-3xl shadow-lg overflow-hidden bg-white">

          {/* Top Colored Area (same div structure inside main card) */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center py-12">
            <h1 className="text-4xl font-bold">My Account</h1>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">

            {/* Name */}
            <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border">
              <FaUser className="text-blue-600 text-3xl" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-lg">{user.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border">
              <FaEnvelope className="text-teal-600 text-3xl" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-lg">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border">
              <FaPhone className="text-purple-600 text-3xl" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-lg">
                  {user.phone || "N/A"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}