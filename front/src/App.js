import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/NavbarComponent';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Home from './Pages/Home';
import CreateEvent from './Pages/CreateEvent';
import MyEvents from './Pages/MyEvents';
import { Route, Routes } from 'react-router-dom';
import {jwtDecode}  from 'jwt-decode';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
function App() {
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = jwtDecode(token);
        setLoggedUser(user.sub);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

    <div>

      <Navbar loggedUser={loggedUser} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/login" element={loggedUser ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={loggedUser ? <Navigate to="/home" /> : <Register />}  />
      </Routes>
    </div>
    </LocalizationProvider>
  );
}

export default App;
