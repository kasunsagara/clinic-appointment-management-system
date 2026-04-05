import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import uploadMediaToSupabase from "../../utils/mediaUpload";

export default function UpdateDoctorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Doctor state
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    bio: "",
    profilePicture: "",
  });

  // image file
  const [profileImageFile, setProfileImageFile] = useState(null);

  // schedule
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

  // ✅ Fetch doctor
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(`/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data.doctor;

        // set doctor
        setDoctor({
          name: data.userId?.name || "",
          email: data.userId?.email || "",
          password: "",
          phone: data.userId?.phone || "",
          specialization: data.specialization || "",
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
        });

        // set schedule
        const fullSchedule = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: []
        };

        Object.keys(data.timeSlots || {}).forEach(day => {
          fullSchedule[day] = data.timeSlots[day];
        });

        setSchedule(fullSchedule);

      } catch (err) {
        console.error("Error fetching doctor:", err);
        toast.error("Failed to load doctor");
      }
    };

    fetchDoctor();
  }, [id]);

  // input change
  const handleInputChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // ✅ Update doctor
  const handleEditDoctor = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Updating doctor...");

    // validation
    const { name, email, phone, specialization, bio } = doctor;
    if (!name || !email || !phone || !specialization || !bio) {
      toast.error("All required fields must be provided", { id: toastId });
      return;
    }

    try {
      let imageUrl = doctor.profilePicture;

      // upload new image
      if (profileImageFile) {
        imageUrl = await uploadMediaToSupabase(profileImageFile);
      }

      // convert schedule
      const availableDays = [];
      const timeSlots = {};

      Object.keys(schedule).forEach(day => {
        if (schedule[day].length > 0) {
          availableDays.push(day);
          timeSlots[day] = schedule[day];
        }
      });

      const token = localStorage.getItem("token");

      const res = await api.put(
        `/doctors/${id}`,
        {
          ...doctor,
          profilePicture: imageUrl,
          availableDays,
          timeSlots
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(res.data.message, { id: toastId });
      navigate("/admin/doctors");

    } catch (err) {
      console.error("Error updating doctor:", err);
      toast.error(
        err.response?.data?.message || "Update failed",
        { id: toastId }
      );
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Doctor</h2>

        <form onSubmit={handleEditDoctor} className="space-y-4">

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={doctor.name}
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
                value={doctor.email}
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
                value={doctor.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Leave empty to keep old password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={doctor.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0773456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <select
                name="specialization"
                value={doctor.specialization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Select specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files[0])}
                className="hidden"
                id="profileImageInput"
              />

              <div className="flex justify-start">
                <label
                  htmlFor="profileImageInput"
                  className="cursor-pointer w-88 text-left px-4 py-2 border rounded-lg"
                >
                  Click to upload file
                </label>
              </div>

              {(profileImageFile || doctor.profilePicture) && (
                <img
                  src={
                    profileImageFile
                      ? URL.createObjectURL(profileImageFile)
                      : doctor.profilePicture
                  }
                  alt="Preview"
                  className="mt-2 max-w-xs h-auto border rounded-lg"
                />
              )}
            </div>

          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={doctor.bio}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="Brief doctor biography..."
            ></textarea>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Schedule</h3>

            {Object.keys(schedule).map(day => (
              <div key={day} className="mb-3">
                <p className="font-medium text-gray-700 mb-1">{day}</p>

                <div className="flex flex-wrap gap-3">
                  {timeOptions.map(slot => (
                    <label
                      key={slot}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg cursor-pointer"
                    >
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
              Update Doctor
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}