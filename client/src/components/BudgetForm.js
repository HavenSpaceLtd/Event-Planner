import React, { useState } from 'react';

const BudgetForm = () => {
  const [eventID, setEventID] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const activeToken = sessionStorage.getItem('accessToken'); // Get JWT token from sessionStorage
      const response = await fetch('/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}` // Include JWT token in Authorization header
        },
        body: JSON.stringify({
          event_id: eventID,
          amount: parseFloat(amount) // Convert amount to float
        })
      });
      const data = await response.json();
      setMessage(data.message); // Set the message from the response
      setEventID(''); // Clear the form fields after submission
      setAmount('');
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  return (
    <div>
      <h2>Set New Budget</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event ID:</label>
          <input
            type="text"
            value={eventID}
            onChange={(e) => setEventID(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Set Budget</button>
      </form>
      {message && <p>{message}</p>} 
    </div>
  );
};

export default BudgetForm;
