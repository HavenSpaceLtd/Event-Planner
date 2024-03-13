import React, { useState, useEffect } from 'react';

function ExpenseTracking() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  return (
    <div>
      <h2>Expense Tracking</h2>
      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            {expense.description} - {expense.amount} - {expense.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseTracking;