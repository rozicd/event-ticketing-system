import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/NavbarComponent';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
