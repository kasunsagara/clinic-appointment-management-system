import { Link } from "react-router-dom";
import { FaGraduationCap, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative">
        <img
          src={doctor.profilePicture || "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg"}
          alt={doctor.userId?.name}
          className="w-full h-56 object-cover object-top"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <FaCheckCircle className="text-green-500 text-sm" />
          <span className="text-xs font-semibold text-gray-700">Available</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">
            Dr. {doctor.userId?.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-blue-600 mb-4 bg-blue-50 w-fit px-3 py-1 rounded-full text-sm font-medium">
          <FaGraduationCap />
          {doctor.specialization}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {doctor.bio}
        </p>

        <div className="space-y-2 mb-6 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaCalendarAlt className="text-gray-400" />
            <span>
              <span className="font-semibold text-gray-700">Days: </span>
              {doctor.availableDays?.join(", ") || "Mon, Wed, Fri"}
            </span>
          </div>
        </div>

        <Link
          to={`/book-appointment/${doctor._id}`}
          className="block w-full text-center bg-blue-50 text-blue-600 font-semibold py-3 rounded-xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
};


