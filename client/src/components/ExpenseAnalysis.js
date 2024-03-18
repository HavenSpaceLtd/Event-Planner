import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

const ExpenseAnalysis = ({ expensesByEvent }) => {
  // Add null or undefined check for expensesByEvent
  if (!expensesByEvent || Object.keys(expensesByEvent).length === 0) {
    return <div>No expenses available</div>;
  }

  // Your expense analysis logic using expensesByEvent
  const eventAnalysis = Object.keys(expensesByEvent).map(eventId => {
    const eventExpenses = expensesByEvent[eventId];
    const eventTotal = eventExpenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    const totalExpense = Object.values(expensesByEvent).reduce((total, event) => {
      return total + event.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    }, 0);
    const categoryPercentages = {};
    eventExpenses.forEach(expense => {
      categoryPercentages[expense.category] = (categoryPercentages[expense.category] || 0) + parseFloat(expense.amount);
    });
    Object.keys(categoryPercentages).forEach(category => {
      categoryPercentages[category] = (categoryPercentages[category] / eventTotal) * 100;
    });

    return {
      eventId,
      eventTotal,
      totalExpense,
      categoryPercentages,
    };
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* <h2>Expense Analysis</h2> */}
      <div style={{ display: 'flex', gap: '20px', padding: '10px 0' }}>
        {eventAnalysis.map(event => (
          <Card key={`event-${event.eventId}`} style={{ minWidth: '300px', maxWidth: '400px' }}>
            <Card.Body>
              <Card.Title>Event ID {event.eventId}</Card.Title>
              <div style={{ overflowX: 'auto' }}>
                <Table striped bordered hover style={{ minWidth: '300px' }}>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Expense</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(event.categoryPercentages).map(category => (
                      <tr key={`category-${category}`}>
                        <td>{category}</td>
                        <td>${event.categoryPercentages[category].toFixed(2)}</td>
                        <td>{event.categoryPercentages[category].toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <p><strong>Total Expense for Event {event.eventId}: ${event.eventTotal.toFixed(2)}</strong></p>
              <p><strong>Total Percentage for Event {event.eventId}: {(event.eventTotal / event.totalExpense * 100).toFixed(2)}%</strong></p>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpenseAnalysis;