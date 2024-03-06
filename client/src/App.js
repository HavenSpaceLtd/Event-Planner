import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Footer from './Components/Footer';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


