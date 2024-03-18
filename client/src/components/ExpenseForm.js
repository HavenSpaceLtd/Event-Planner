// ExpenseForm.js
import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ addExpense }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [eventId, setEventId] = useState('');

  // Retrieve event ID from session storage on component mount
  useEffect(() => {
    const storedEventId = sessionStorage.getItem('eventId');
    if (storedEventId) {
      setEventId(storedEventId);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = sessionStorage.getItem('accessToken'); // Get JWT token from session storage
      const response = await fetch('/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include JWT token in Authorization header
        },
        body: JSON.stringify({
          amount,
          category,
          description,
          event_id: eventId
        })
      });

      if (response.ok) {
        // Expense added successfully
        const newExpense = await response.json(); // Assuming the server returns the newly created expense
        addExpense(newExpense); // Add the new expense to the state
        alert('Expense added successfully!');
        // Clear the form
        setAmount('');
        setCategory('');
        setDescription('');
        setEventId('');
        // Remove event ID from session storage
        sessionStorage.removeItem('eventId');
      } else {
        // Error occurred while adding expense
        const errorMessage = await response.json();
        alert(errorMessage.Error || 'Failed to add expense!');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense!');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 mb-5">
          <div className="card shadow p-4">
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">Amount:</label>
                <input
                  type="text"
                  id="amount"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category:</label>
                <select
                  id="category"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Transport">Transport</option>
                  <option value="Catering">Catering</option>
                  <option value="Tents">Tents</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Venue">Venue</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Security">Security</option>
                  <option value="Other">Any other</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="eventId" className="form-label">Event ID:</label>
                <input
                  type="text"
                  id="eventId"
                  className="form-control"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Add Expense</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
