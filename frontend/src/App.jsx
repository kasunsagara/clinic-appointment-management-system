import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signUpPage';
import AdminDashboard from './pages/adminDashboard';
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
    <Route path="/admin/*" element={<AdminDashboard/>}/> 
    <Route path="/doctor/*" element={<DoctorHomePage/>}/>
    <Route path="/*" element={<h1>404 error</h1>}/>
    </Routes>
    </BrowserRouter> 
    </>
  )
}

export default App;