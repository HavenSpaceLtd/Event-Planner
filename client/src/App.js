import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';

import Footer from './Components/Footer';
import Navbar from './Components/Navbar';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
       
      
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
