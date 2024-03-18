import React from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ChartAnalysis = ({ expensesByEvent }) => {
  // Add null or undefined check for expensesByEvent
  if (!expensesByEvent || Object.keys(expensesByEvent).length === 0) {
    return <div>No expenses available</div>;
  }

  // Function to calculate category-wise totals for each event
  const calculateCategoryTotalsByEvent = eventId => {
    const categoryTotals = {};

    expensesByEvent[eventId].forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += parseFloat(expense.amount);
      } else {
        categoryTotals[expense.category] = parseFloat(expense.amount);
      }
    });

    return categoryTotals;
  };

  // Function to convert category totals to chart data format
  const convertToChartData = (eventId, categoryTotals) => {
    const chartData = [];

    for (const category in categoryTotals) {
      chartData.push({ category, amount: categoryTotals[category] });
    }

    return chartData;
  };

  // Convert expenses data to chart data format for each event
  const eventCharts = Object.keys(expensesByEvent).map(eventId => {
    const categoryTotals = calculateCategoryTotalsByEvent(eventId);
    const chartData = convertToChartData(eventId, categoryTotals);

    return (
      <div key={`chart-${eventId}`} style={{ minWidth: '50%', maxWidth: '50%', padding: '10px' }}>
        <h3>Event ID {eventId}</h3>
        <div style={{ overflowX: 'auto' }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  });

  return (
    <div style={{ overflowX: 'auto', display: 'flex' }}>
      {eventCharts}
    </div>
  );
};

export default ChartAnalysis;
