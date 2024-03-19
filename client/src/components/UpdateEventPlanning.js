import React, { useState } from 'react';
import BudgetPlanning from './BudgetPlanning'; // Import BudgetPlanning component
import ResourceManagement from './ResourceManagement'; // Import ResourceManagement component
import ExpenseTracking from './ExpenseTracker'; // Import ExpenseTracking component

const UpdateEventPlanning = () => {
  const [activeOption, setActiveOption] = useState(null);

  const handleOptionClick = (option) => {
    setActiveOption(option);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Notice: Update Your Event Planning</h5>
        <p className="card-text">
          Noticed an error in your resources, expenses, or budget? No worries! You can update or delete any incorrect entries to ensure your event planning is on track.
        </p>
        <div className="btn-group" role="group" aria-label="Update Options">
          <button
            type="button"
            className={`btn btn-primary ${activeOption === 'budget' ? 'active' : ''}`}
            onClick={() => handleOptionClick('budget')}
            disabled={activeOption === 'budget'}
          >
            Update Budget
          </button>
          <button
            type="button"
            className={`btn btn-primary ${activeOption === 'resource' ? 'active' : ''}`}
            onClick={() => handleOptionClick('resource')}
            disabled={activeOption === 'resource'}
          >
            Update Resources
          </button>
          {/* <button
            type="button"
            className={`btn btn-primary ${activeOption === 'expense' ? 'active' : ''}`}
            onClick={() => handleOptionClick('expense')}
            disabled={activeOption === 'expense'}
          >
            Update Expenses
          </button> */}
        </div>
        {activeOption === 'budget' && <BudgetPlanning />}
        {activeOption === 'resource' && <ResourceManagement />}
        {/* {activeOption === 'expense' && <ExpenseTracking />} */}
      </div>
    </div>
  );
}

export default UpdateEventPlanning;
