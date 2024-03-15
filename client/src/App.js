import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import SignInForm from './components/SignInForm';
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
import Dashboard from './components/Dashboard';
import NavBar2 from './components/Navbar2';


function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Dashboard />} />
          <Route path="/login" element={<SignInForm />} />
          <Route path="/tasks" element={<Home />} />
          <Route path="/collaboration"  element={<div> <Chatbox/>  < Collaboration /> </div>} />
          <Route path='/myevents' component={<BudgetForm/>} />
          <Route path='/mytasks' component={<BudgetPlanning/>} />
          <Route path='/important' component={<ExpenseForm/>} />
          <Route path='/highpriority' component={<ExpenseTracking/>} />
          <Route path="/resources" element={<div>
            <ExpenseTracking />
            < Charts />
             < BudgetPlanning />
       
             <ResourceManagement />
         <ResourceForm />
           <ExpenseForm />
         
            <BudgetForm />
           
            </div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;