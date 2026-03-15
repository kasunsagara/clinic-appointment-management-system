import { useState, useEffect } from "react";
import { Link, Route, Routes } from 'react-router-dom';
import { BsGraphUp, BsPeople, BsCalendar, BsPerson } from 'react-icons/bs'; 
import ManageDoctorsPage from './admin/manageDoctorsPage';

export default function DoctorHomePage() {
    const [user, setUser] = useState(null);

    // Load user from localStorage (same as Header)
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <div className="w-full h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-[20%] h-screen bg-white shadow-lg flex flex-col p-5 space-y-4">
                <Link 
                    to="/" 
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                >
                    <BsGraphUp size={20} /> Dashboard
                </Link>
                <Link 
                    to="/appointments" 
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                >
                    <BsCalendar size={20} /> Patient Appointments
                </Link>
            </div>

            {/* Main Content */}
            <div className="w-[80%] h-screen p-8 overflow-y-auto">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <h1 className="text-3xl font-bold text-gray-700">
                                {user ? `Welcome to Doctor, ${user.name}` : "Welcome Doctor"}
                            </h1>
                        }
                    />
                    <Route 
                        path="/dashboard" 
                        element={<h1 className="text-3xl font-bold text-gray-700">{user ? `Doctor ${user.name} Dashboard` : "Doctor Dashboard"}</h1>} 
                    />
                    <Route 
                        path="/appointments" 
                        element={<h1 className="text-3xl font-bold text-gray-700">Manage Appointments</h1>} 
                    />
                    <Route 
                        path="*" 
                        element={<h1 className="text-3xl font-bold text-red-500">Doctor 404 Error</h1>} 
                    />
                </Routes>
            </div>
        </div>
    )
}