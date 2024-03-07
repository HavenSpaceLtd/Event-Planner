import React, { useState } from 'react';

const BudgetForm = ({ onSubmit }) => {
  const [eventName, setEventName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventName,
          budgetAmount
        })
      });
      const data = await response.json();
      onSubmit(data);
      setEventName('');
      setBudgetAmount('');
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Budget Amount"
        value={budgetAmount}
        onChange={(e) => setBudgetAmount(e.target.value)}
      />
      <button type="submit">Set Budget</button>
    </form>
  );
};

export default BudgetForm;
