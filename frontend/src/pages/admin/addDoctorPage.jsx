import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import uploadMediaToSupabase from "../../utils/mediaUpload";

export default function AddDoctorPage() {
  const navigate = useNavigate();

  // Doctor basic info
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    bio: "",
    profilePicture: "",
  });

  // ✅ new state for file
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Schedule: day-wise time slots
  const [schedule, setSchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });

  const timeOptions = [
    "08:00 AM - 11:00 AM",
    "12:00 PM - 03:00 PM",
    "04:00 PM - 07:00 PM"
  ];

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedic",
    "Dentist",
    "Psychiatrist",
    "Ophthalmologist"
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleAddDoctor = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Adding doctor...");

    // ✅ Frontend validation
    const { name, email, password, phone, specialization, bio } = newDoctor;
    if (!name || !email || !password || !phone || !specialization || !bio) {
      toast.error("All required fields must be provided", { id: toastId });
      return;
    }

    // ✅ upload image
    let imageUrl = "";

    if (profileImageFile) {
      try {
        imageUrl = await uploadMediaToSupabase(profileImageFile);
      } catch (err) {
        toast.error("Image upload failed", { id: toastId });
        return;
      }
    }

    // Convert schedule object to backend-compatible arrays
    const availableDays = [];
    const timeSlots = {};
    Object.keys(schedule).forEach(day => {
      if (schedule[day].length > 0) {
        availableDays.push(day);
        timeSlots[day] = schedule[day];
      }
    });

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/doctors",
        {
          ...newDoctor,
          profilePicture: imageUrl, // ✅ set uploaded image URL
          availableDays,
          timeSlots
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.message === "Doctor created successfully") {
        toast.success(response.data.message, { id: toastId });
        navigate("/admin/doctors");
      } else {
        toast.error(response.data.message || "Failed to add doctor", { id: toastId });
      }
    } catch (error) {
      console.error("Error adding doctor:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error adding doctor", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h2>

        <form onSubmit={handleAddDoctor} className="space-y-4">

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                value={newDoctor.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={newDoctor.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="jane@clinic.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={newDoctor.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                required
                value={newDoctor.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0773456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <select
                name="specialization"
                required
                value={newDoctor.specialization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Select specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* ✅ file upload එක */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files[0])}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              required
              value={newDoctor.bio}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="Brief doctor biography..."
            ></textarea>
          </div>

          {/* Day-wise Schedule with Checkboxes */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Schedule</h3>
            {Object.keys(schedule).map(day => (
              <div key={day} className="mb-3">
                <p className="font-medium text-gray-700 mb-1">{day}</p>
                <div className="flex flex-wrap gap-3">
                  {timeOptions.map(slot => (
                    <label key={slot} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule[day].includes(slot)}
                        onChange={(e) => {
                          setSchedule(prev => {
                            const updatedSlots = e.target.checked
                              ? [...prev[day], slot]
                              : prev[day].filter(s => s !== slot);
                            return { ...prev, [day]: updatedSlots };
                          });
                        }}
                      />
                      {slot}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/doctors")}
              className="px-5 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-sm transition-colors"
            >
              Add Doctor
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}