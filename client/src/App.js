import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInFrom';


function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<div>
            <SignInForm />
            <SignUpForm />
          </div>} />
        </Routes>
        <Footer />
       
      </div>
    </Router>
  );
}

export default App;