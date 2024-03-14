import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import SignInForm from './components/SignInForm';
import ResourceForm from './components/ResourceForm';
import BudgetForm from './components/BudgetForm';
import ExpenseForm from './components/ExpenseForm';
import Home from './components/Home';
import BudgetTracker from './components/BudgetTracker';
import Chatbox from './components/Chatbox';
import EventCard from './components/EventCard';


function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignInForm />} />
          <Route path="/collaboration"  element={<Chatbox />} />
          <Route path="/event" element={<EventCard />} />
          <Route path="/resources" element={<div>
            <ResourceForm />
            <BudgetForm />
            <ExpenseForm />
            <BudgetTracker />
            </div>} />
            
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;