import React, { useState, useEffect } from 'react';
import ChartAnalysis from './ChartAnalysis';
import ExpenseAnalysis from './ExpenseAnalysis';
import './ExpenseTracking.css';

function ExpenseTracking() {
  const [expensesByEvent, setExpensesByEvent] = useState({});
  const [editedExpense, setEditedExpense] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedAmount, setEditedAmount] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
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
      organizeExpensesByEvent(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const organizeExpensesByEvent = (expenses) => {
    const groupedExpenses = {};
    expenses.forEach((expense) => {
      if (!(expense.event_id in groupedExpenses)) {
        groupedExpenses[expense.event_id] = [];
      }
      groupedExpenses[expense.event_id].push(expense);
    });
    setExpensesByEvent(groupedExpenses);
  };

  const handleDeleteExpense = async (event_id, expenseId) => {
    try {
      const response = await fetch(`/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
      // Remove the deleted expense from state
      setExpensesByEvent((prevExpenses) => ({
        ...prevExpenses,
        [event_id]: prevExpenses[event_id].filter(expense => expense.id !== expenseId),
      }));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = (expense) => {
    setEditedExpense(expense);
    setEditedDescription(expense.description);
    setEditedAmount(expense.amount);
    setEditedCategory(expense.category);
  };

  const handleUpdateExpense = async () => {
    try {
      const response = await fetch(`/expenses/${editedExpense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          description: editedDescription,
          amount: editedAmount,
          category: editedCategory,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update expense');
      }
      // Refetch expenses to update the UI
      fetchExpenses();
      // Clear edit state
      setEditedExpense(null);
      setEditedDescription('');
      setEditedAmount('');
      setEditedCategory('');
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-3">Expense Tracking</h2>
      <div className="d-flex flex-wrap justify-content-center">
        <div className="scroll-container">
          {Object.keys(expensesByEvent).length > 0 ? (
            Object.entries(expensesByEvent).map(([eventId, eventExpenses]) => (
              <div className="card mx-2 mb-3" key={eventId} style={{ width: '18rem' }}>
                <h5 className="card-header">Event ID: {eventId}</h5>
                <div className="card-body">
                  {eventExpenses.map((expense) => (
                    <div className="card mb-2" key={expense.id}>
                      <div className="card-body">
                        {editedExpense === expense ? (
                          <div>
                            <input
                              type="text"
                              className="form-control mb-2"
                              placeholder="Description"
                              value={editedDescription}
                              onChange={(e) => setEditedDescription(e.target.value)}
                            />
                            <input
                              type="number"
                              className="form-control mb-2"
                              placeholder="Amount"
                              value={editedAmount}
                              onChange={(e) => setEditedAmount(e.target.value)}
                            />
                            <input
                              type="text"
                              className="form-control mb-2"
                              placeholder="Category"
                              value={editedCategory}
                              onChange={(e) => setEditedCategory(e.target.value)}
                            />
                            <button
                              className="btn btn-primary mr-2"
                              onClick={handleUpdateExpense}
                            >
                              Update
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => setEditedExpense(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div>
                            <h6 className="card-title">{expense.description}</h6>
                            <p className="card-text">Amount: {expense.amount}</p>
                            <p className="card-text">Category: {expense.category}</p>
                            <div className="mb-2">
                              <button
                                className="btn btn-primary mr-3"
                                onClick={() => handleEditExpense(expense)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteExpense(eventId, expense.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No expenses found.</p>
          )}
        </div>
      </div>
      <div className="container">
        <h1 className="text-center mt-3">REPORTS</h1>
        <h2 className="text-center mt-3">Table and Charts Analysis for all Expenses per Event</h2>
        <div className="d-flex flex-wrap justify-content-center">
          <ExpenseAnalysis expensesByEvent={expensesByEvent} />
        </div>
        <div className="d-flex flex-wrap justify-content-center">
          <ChartAnalysis expensesByEvent={expensesByEvent} />
        </div>
      </div>
    </div>
  );
}

export default ExpenseTracking;
