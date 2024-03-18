import React, { useState } from 'react';

const BudgetForm = () => {
  const [eventID, setEventID] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const activeToken = sessionStorage.getItem('accessToken');
      const response = await fetch('/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          event_id: eventID,
          amount: parseFloat(amount)
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setEventID('');
        setAmount('');
      } else {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage('Failed to set budget. Please try again.'); 
        }
      }
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Set New Budget</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="eventID" className="form-label">Event ID:</label>
                  <input
                    type="text"
                    id="eventID"
                    className="form-control"
                    value={eventID}
                    onChange={(e) => setEventID(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">Amount:</label>
                  <input
                    type="number"
                    id="amount"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Set Budget</button>
              </form>
              {message && <p className="mt-3">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;

