import React, { useState, useEffect } from 'react';

function BudgetPlanning() {
  const [budgets, setBudgets] = useState([]);
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [newAmount, setNewAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const activeUser = sessionStorage.getItem('userId');
  const activeToken = sessionStorage.getItem('accessToken');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = () => {
    fetch(`/budgets`, {
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }
      return response.json();
    })
    .then(budgetsData => {
      setBudgets(budgetsData);
    })
    .catch(error => {
      setError(error.message);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const handleUpdateBudget = (budgetId) => {
    setEditingBudgetId(budgetId);
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    fetch(`/budgets/${editingBudgetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeToken}`,
      },
      body: JSON.stringify({ amount: newAmount }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update budget');
      }
      setEditingBudgetId(null);
      setNewAmount('');
      fetchBudgets();
    })
    .catch(error => {
      console.error('Error updating budget:', error);
    });
  };

  const handleCancelUpdate = () => {
    setEditingBudgetId(null);
    setNewAmount('');
  };

  const handleDeleteBudget = (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      fetch(`/budgets/${budgetId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete budget');
        }
        fetchBudgets();
      })
      .catch(error => {
        console.error('Error deleting budget:', error);
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Budget Planning</h2>
   <ul>
  {budgets.length > 0 ? (
    budgets.map((budget) => (
      <li key={budget.id}>
        Event ID: {budget.event_id} - Amount: {editingBudgetId === budget.id ? (
          <form onSubmit={handleSubmitUpdate}>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={handleCancelUpdate}>Cancel</button>
          </form>
        ) : (
          <span>{budget.amount}</span>
        )}
        <button onClick={() => handleUpdateBudget(budget.id)}>Update</button>
        <button onClick={() => handleDeleteBudget(budget.id)}>Delete</button>
      </li>
    ))
  ) : (
    <li>No budgets available.</li>
  )}
</ul>
    </div>
  );
}

export default BudgetPlanning;
