import React, { useState, useEffect } from 'react';

function BudgetPlanning() {
  const [budgets, setBudgets] = useState([]);
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/budgets');
      const budgetsData = await response.json();
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleUpdateBudget = async (budgetId) => {
    setEditingBudgetId(budgetId);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/budgets/${editingBudgetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: newAmount }),
      });
      setEditingBudgetId(null);
      setNewAmount('');
      fetchBudgets(); // Refresh budgets after update
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleCancelUpdate = () => {
    setEditingBudgetId(null);
    setNewAmount('');
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await fetch(`/budgets/${budgetId}`, {
        method: 'DELETE',
      });
      fetchBudgets(); // Refresh budgets after deletion
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <div>
      <h2>Budget Planning</h2>
      <ul>
        {budgets.map(budget => (
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
        ))}
      </ul>
    </div>
  );
}

export default BudgetPlanning;
