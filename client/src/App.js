import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInFrom';
import ResourceForm from './components/ResourceForm';
import ResourceList from './components/Resource';
import BudgetForm from './components/BudgetForm';
import BudgetTracker from './components/BudgetTracker';
import Chart from './components/Chart';
import ExpenseForm from './components/ExpenseForm';
import Home from './components/Home'

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<div>
            <SignInForm />
            <SignUpForm /> 
             {/* <ResourceList /> */}
        <ResourceForm />
        <BudgetForm />
        {/* <BudgetTracker /> */}
        < ExpenseForm  />
        <Home />
        {/* <Chart /> */}
          </div>} />
        </Routes>
        <Footer />
       
      </div>
    </Router>
  );
}

export default App;