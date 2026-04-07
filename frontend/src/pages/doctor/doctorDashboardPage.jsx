import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { BsCalendar, BsPeople } from "react-icons/bs";
import { FaUserMd } from "react-icons/fa";

export default function DoctorDashboardPage() {
  const [totalappointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Unauthorized: Please log in first");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [appointmentsRes] = await Promise.all([
          api.get("/appointments"),
        ]);

        setTotalAppointments(appointmentsRes.data.list?.length || 0);

      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // ✅ IMPORTANT

  }, []);

  if (loading) {
    return <div className="p-6 text-lg">Loading Dashboard...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <div className="bg-purple-500 text-white p-6 rounded-xl shadow flex items-center gap-6">
          <BsCalendar className="text-3xl" />
          <div>
            <h2 className="text-lg">Total Appointments</h2>
            <p className="text-3xl font-bold">{totalappointments}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

