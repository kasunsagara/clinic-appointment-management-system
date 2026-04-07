import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signUpPage';
import DoctorsPage from './pages/doctorsPage';
import BookAppointmentPage from './pages/bookAppintmentPage';
import MyAppointmentsPage from './pages/myAppoinmentsPage';
import MyAccountPage from './pages/myAccountPage';
import AdminHomePage from './pages/adminHomePage';
import DoctorHomePage from './pages/doctorHomePage';

function App() {

  return (
    <>
    <BrowserRouter> 
    <Toaster position="top-right"  />
    <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/register" element={<SignUpPage/>}/>
    <Route path="/doctors" element={<DoctorsPage/>}/>
    <Route path="/book-appointment/:id" element={<BookAppointmentPage />} />
    <Route path="/my-appointments" element={<MyAppointmentsPage />} />
    <Route path="/my-account" element={<MyAccountPage />} />
    <Route path="/admin/*" element={<AdminHomePage/>}/> 
    <Route path="/doctor/*" element={<DoctorHomePage/>}/>
    </Routes>
    </BrowserRouter> 
    </>
  )
}

export default App;