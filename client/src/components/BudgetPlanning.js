import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

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
    <div className="d-flex justify-content-center">
      <div className="shadow p-3 mb-5 bg-white rounded">
        <h2>Budget Planning</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.length > 0 ? (
              budgets.map((budget) => (
                <tr key={budget.id}>
                  <td>{budget.event_id}</td>
                  <td>
                    {editingBudgetId === budget.id ? (
                      <form onSubmit={handleSubmitUpdate}>
                        <input
                          type="number"
                          value={newAmount}
                          onChange={(e) => setNewAmount(e.target.value)}
                          required
                        />
                        <Button type="submit" variant="primary">Submit</Button>
                        <Button type="button" onClick={handleCancelUpdate} variant="secondary">Cancel</Button>
                      </form>
                    ) : (
                      <span>{budget.amount}</span>
                    )}
                  </td>
                  <td>
                    <Button onClick={() => handleUpdateBudget(budget.id)} variant="info">Update</Button>
                    <Button onClick={() => handleDeleteBudget(budget.id)} variant="danger">Delete</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No budgets available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BudgetPlanning;
