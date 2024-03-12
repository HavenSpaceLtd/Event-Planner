import React, { useState } from 'react';

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [event_id, setEventId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          category,
          description,
          event_id
        })
      });

      if (response.ok) {
        // Expense added successfully
        alert('Expense added successfully!');
        // Clear the form
        setAmount('');
        setCategory('');
        setDescription('');
        setEventId('');
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
    <div>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <br />
        <label>
          Category:
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </label>
        <br />
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <label>
          Event ID:
          <input type="text" value={event_id} onChange={(e) => setEventId(e.target.value)} />
        </label>
        <br />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
