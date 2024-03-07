import React from 'react';

const BudgetTracker = ({ event }) => {
  const totalExpenses = event.expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const remainingBudget = event.budget - totalExpenses;

  return (
    <div>
      <h3>{event.name}</h3>
      <p>Budget: ${event.budget}</p>
      <p>Total Expenses: ${totalExpenses}</p>
      <p>Remaining Budget: ${remainingBudget}</p>
      <div style={{ backgroundColor: remainingBudget >= 0 ? 'green' : 'red', width: `${(totalExpenses / event.budget) * 100}%`, height: '20px' }}></div>
    </div>
  );
};

export default BudgetTracker;