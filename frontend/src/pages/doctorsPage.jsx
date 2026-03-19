import { useState, useEffect } from "react";
import api from "../services/api";
import DoctorCard from "../components/doctorCard";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");

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

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");
        if (response.data.list) {
          setDoctors(response.data.list);
          setFilteredDoctors(response.data.list);
        }
      } catch (error) {
        toast.error("Failed to fetch doctors");
        console.error("Error fetching doctors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    let result = doctors;

    if (searchTerm) {
      result = result.filter(
        (doc) =>
          doc.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialization) {
      result = result.filter((doc) => doc.specialization === specialization);
    }

    setFilteredDoctors(result);
  }, [searchTerm, specialization, doctors]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Specialist Doctors</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and book an appointment with our experienced doctors. Use the filters below to find the perfect match for your healthcare needs.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 w-full py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white text-gray-800"
              />
            </div>

            <div>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white text-gray-800"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="bg-white text-center py-16 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-gray-400 w-16 h-16 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
              <FaSearch className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};


