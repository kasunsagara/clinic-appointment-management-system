import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import SignUpPage from './pages/signUpPage';
import AdminHomePage from './pages/adminHomePage';

function App() {

  return (
    <>
    <BrowserRouter> 
    <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/register" element={<SignUpPage/>}/>
    <Route path="/admin/*" element={<AdminHomePage/>}/> 
    <Route path="/*" element={<h1>404 error</h1>}/>
    </Routes>
    </BrowserRouter> 
    </>
  )
}

export default App;