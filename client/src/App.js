import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import SignInForm1 from './components/SignInForm1';
import ResourceForm from './components/ResourceForm';
import BudgetForm from './components/BudgetForm';
import ExpenseForm from './components/ExpenseForm';
import Home from './components/Home';
import Charts from './components/Chart';
import Chatbox from './components/Chatbox';
import BudgetPlanning from './components/BudgetPlanning';
import ExpenseTracking from './components/ExpenseTracker';
import ResourceManagement from './components/ResourceManagement';
import Collaboration from './components/Collaboration';



function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<SignInForm1 />} />
          <Route path="/login" element={<SignInForm1 />} />
          <Route path="/home" element={<Home />} />
          <Route path="/collaboration"  element={<div> <Chatbox/>  < Collaboration /> </div>} />
          <Route path="/resources" element={<div>
            <ResourceForm />
            <BudgetForm />
            <ExpenseForm />
            < Charts />

             < BudgetPlanning />
        <ExpenseTracking />
        <ResourceManagement />
            </div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;