import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import AdminHomePage from './pages/adminHomePage';


function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/admin/*" element={<AdminHomePage/>}/>
    <Route path="/*" element={<h1>404 error</h1>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;
