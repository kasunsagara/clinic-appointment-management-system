import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { FaCalendarAlt, FaClock, FaClipboardList, FaUserMd, FaUser, FaUserAlt } from "react-icons/fa";

export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    name: "",
    age: "",
    reason: ""
  });

  const [availableTimes, setAvailableTimes] = useState([]);

  // Helper: get day name from date
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" }); // "Monday", "Tuesday", ...
  };

  useEffect(() => {
    if (!user) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    const fetchDoctor = async () => {
      try {
        const response = await api.get(`/doctors/${id}`);
        if (response.data.doctor) {
          setDoctor(response.data.doctor); // doctor object fetched from DB
        } else {
          toast.error("Doctor not found");
          navigate("/doctors");
        }
      } catch (error) {
        toast.error("Failed to fetch doctor details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If date changed, update available times based on day
    if (name === "date" && doctor) {
      const dayName = getDayName(value); // e.g., "Monday"
      if (doctor.availableDays?.includes(dayName)) {
        setAvailableTimes(doctor.timeSlots?.[dayName] || []);
      } else {
        setAvailableTimes([]);
        toast.error(`Doctor is not available on ${dayName}`);
      }
      setFormData((prev) => ({ ...prev, time: "" })); // reset previous time
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      toast.error("Please select both date and time");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Booking your appointment...");

    try {
      const response = await api.post("/appointments", {
        doctorId: id,
        date: formData.date,
        time: formData.time,
        patient: {
          name: formData.name || user.name,
          age: formData.age,
          reason: formData.reason
        }
      });

      if (response.data.message === "Appointment created successfully") {
        toast.success("Appointment successfully booked!", { id: toastId });
        navigate("/my-appointments");
      } else {
        toast.error(response.data.message || "Failed to book appointment", { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error booking appointment", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Doctor Info */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6 text-center border-b border-gray-100">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-blue-50 shadow-md">
                <img
                  src={doctor?.profilePicture || "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg"}
                  alt={doctor?.userId?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Dr. {doctor?.userId?.name}
              </h2>
              <p className="text-blue-600 font-medium mb-2">{doctor?.specialization}</p>
            </div>

            <div className="p-6 bg-slate-50">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <FaUserMd className="text-gray-400" /> Professional Details
              </h3>
              <p className="text-sm text-gray-600 mb-4">{doctor?.bio}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between pb-2 border-b border-gray-200 text-gray-600">
                  <span className="font-medium text-gray-700">Available Days:</span>
                  <span>{doctor?.availableDays?.join(", ") || "Mon, Wed, Fri"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h2>
              <p className="text-gray-600">Please fill in the details below to complete your booking.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" /> Select Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaClock className="text-blue-500" /> Select Time
                  </label>
                  <select
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                  >
                    <option value="">Choose a time slot</option>
                    {availableTimes.length > 0 ? (
                      availableTimes.map((slot, i) => <option key={i} value={slot}>{slot}</option>)
                    ) : (
                      <option disabled>No available slots</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Patient Details */}
              <div className="mt-6">
                <h1 className="text-gray-500 font-semibold mb-4">Patient Details</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaUser className="text-blue-500" /> Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="john doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaUserAlt className="text-blue-500" /> Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaClipboardList className="text-blue-500" /> Reason (Optional)
                    </label>
                    <textarea
                      name="reason"
                      rows="4"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="e.g. headache, checkup..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>

                </div>
              </div>    

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 text-white rounded-xl ${submitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {submitting ? "Processing..." : "Confirm Appointment"}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}