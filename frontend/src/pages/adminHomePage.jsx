import { Link, Route, Routes } from 'react-router-dom';
import { BsGraphUp, BsPeople, BsCalendar, BsPerson } from 'react-icons/bs'; 

export default function AdminHomePage() {
    return (
        <div className="w-full h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-[20%] h-screen bg-white shadow-lg flex flex-col p-5 space-y-4">
                <Link 
                    to="/admin/dashboard" 
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                >
                    <BsGraphUp size={20} /> Dashboard
                </Link>
                <Link 
                    to="/admin/doctors" 
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                >
                    <BsPeople size={20} /> Doctors
                </Link>
                <Link 
                    to="/admin/appointments" 
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                >
                    <BsCalendar size={20} /> Appointments
                </Link>
                <Link 
                    to="/admin/users" 
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                >
                    <BsPerson size={20} /> Users
                </Link>
            </div>

            {/* Main Content */}
            <div className="w-[80%] h-screen p-8 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<h1 className="text-3xl font-bold text-gray-700">Welcome to Admin Panel</h1>} />
                    <Route path="/dashboard" element={<h1 className="text-3xl font-bold text-gray-700">Admin Dashboard</h1>} />
                    <Route path="/doctors" element={<h1 className="text-3xl font-bold text-gray-700">Manage Doctors</h1>} />
                    <Route path="/appointments" element={<h1 className="text-3xl font-bold text-gray-700">Manage Appointments</h1>} />
                    <Route path="/users" element={<h1 className="text-3xl font-bold text-gray-700">Manage Users</h1>} />
                    <Route path="/*" element={<h1 className="text-3xl font-bold text-red-500">Admin 404 error</h1>} />
                </Routes>
            </div>
        </div>
    )
}
