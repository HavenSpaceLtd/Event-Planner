import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInFrom';
import { Navbar } from 'react-bootstrap';
import Home from './components/Home';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<div>
            <SignInForm />
            <SignUpForm />
            <Home />
            
          </div>} />
        </Routes>
        <Footer />
       
      </div>
    </Router>
  );
}

export default App;