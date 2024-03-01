import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInFrom';

function App() {
  return (
    
      <div className="App">
        <NavBar />
        < SignInForm />
        < SignUpForm />
        <Footer />
      </div>
    
  );
}

export default App;
