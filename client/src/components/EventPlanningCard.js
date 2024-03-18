import React, { useState } from 'react';
import ResourceForm from './ResourceForm'; // Import your ResourceForm component
import ExpenseForm from './ExpenseForm'; // Import your ExpenseForm component
import BudgetForm from './BudgetForm'; // Import your BudgetForm component

const EventPlanningCard = () => {
  const [activeForm, setActiveForm] = useState(null);

  const handleFormChange = (formName) => {
    setActiveForm(formName);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Attention Event Planners!</h5>
        <p className="card-text">
          Are you ready to organize a spectacular event? Make sure you're equipped with all the essentials by following these three crucial steps:
        </p>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => handleFormChange('resource')}
            >
              Add Resource:
            </span>
            {activeForm === 'resource' && <ResourceForm />}
          </li>
          <li className="list-group-item">
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => handleFormChange('expense')}
            >
              Add Expense:
            </span>
            {activeForm === 'expense' && <ExpenseForm />}
          </li>
          <li className="list-group-item">
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => handleFormChange('budget')}
            >
              Set Budget:
            </span>
            {activeForm === 'budget' && <BudgetForm />}
          </li>
        </ul>
        <p className="card-text">
          With these steps completed, you'll be well-prepared to orchestrate an unforgettable event. Get started now and watch your vision come to life!
        </p>
      </div>
    </div>
  );
}

export default EventPlanningCard;