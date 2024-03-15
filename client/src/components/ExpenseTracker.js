import React, { useState, useEffect } from 'react';

function ExpenseTracking() {
  const [expenses, setExpenses] = useState([]);
  const activeUser = sessionStorage.getItem('userId');
  const activeToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`/expenses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  return (
    <div style={{ float: 'left', marginLeft: '20px' }}> {/* Apply inline styles for positioning */}
      <h2 style={{ color: 'brown' }}>Expense Tracking</h2> {/* Apply inline style for heading color */}
      <ul style={{ listStyle: 'none', padding: 0 }}> {/* Apply inline styles for list */}
        {expenses.map((expense) => (
          <li key={expense.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}> {/* Apply inline styles for list item */}
            <span style={{ fontWeight: 'bold' }}>Event ID: {expense.id}</span> {/* Apply inline style for event ID */}
            <br />
            <span style={{ marginRight: '10px' }}>{expense.description}</span> {/* Apply inline style for description */}
            <span style={{ marginRight: '10px' }}>{expense.amount}</span> {/* Apply inline style for amount */}
            <span style={{ color: '#28a745' }}>{expense.category}</span> {/* Apply inline style for category */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseTracking;

