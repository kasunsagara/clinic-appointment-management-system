import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddDoctorPage() {
  const navigate = useNavigate();
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    bio: "",
    profilePicture: "",
    availableDays: "",
    timeSlots: ""
  });

  const handleInputChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Adding doctor...");

    try {
      const token = localStorage.getItem("token");

      // API request directly with processed data
      const response = await api.post("/doctors", {
        ...newDoctor,
        availableDays: newDoctor.availableDays.split(",").map(d => d.trim()),
        timeSlots: newDoctor.timeSlots.split(",").map(t => t.trim())
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Backend response:", response.data);

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
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Doctor</h2>
        <form onSubmit={handleAddDoctor} className="space-y-4">
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
              placeholder="Dr. Jane Doe" 
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
              <input 
              type="text" 
              name="specialization" 
              required 
              value={newDoctor.specialization} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Cardiologist" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL (Optional)</label>
              <input 
              type="text" 
              name="profilePicture" 
              value={newDoctor.profilePicture} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="https://..." 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea name="bio" required value={newDoctor.bio} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Brief doctor biography..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Days (comma separated)</label>
              <input type="text" name="availableDays" required value={newDoctor.availableDays} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Monday, Wednesday, Friday" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slots (comma separated)</label>
              <input type="text" name="timeSlots" required value={newDoctor.timeSlots} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="09:00-12:00, 14:00-17:00" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => navigate("/admin/doctors")} className="px-5 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-sm transition-colors">
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}