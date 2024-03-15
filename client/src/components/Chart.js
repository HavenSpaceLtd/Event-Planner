import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Table } from 'antd';

const Charts = ({ expenseData }) => {
  // Mock expense data
  const mockExpenseData = {
    labels: ['Food', 'Venue', 'Power', 'Entertainment equipment'],
    expenses: [1000, 2000, 1500, 800],
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; 

  const totalExpense = mockExpenseData.expenses.reduce((acc, curr) => acc + curr, 0);

  const expenseTableData = mockExpenseData.labels.map((label, index) => ({
    category: label,
    expense: mockExpenseData.expenses[index],
    percentage: ((mockExpenseData.expenses[index] / totalExpense) * 100).toFixed(2),
  }));

  // Cost-saving opportunities
  const costOpportunities = [
    {
      category: 'Power',
      expense: 1500,
      potentialSavings: 300, // Example: Using solar power could save $300
      alternative: 'Solar power',
    },
    // Add more cost-saving opportunities here
  ];

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '25%', // Adjust the width of the column
    },
    {
      title: 'Expense ($)',
      dataIndex: 'expense',
      key: 'expense',
      width: '25%', // Adjust the width of the column
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      width: '25%', // Adjust the width of the column
    },
    {
      title: 'Alternative',
      dataIndex: 'alternative',
      key: 'alternative',
      width: '25%', // Adjust the width of the column
    },
  ];

  return (
    <div>
      <h2>Expense Analysis</h2>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', marginRight: '20px' }}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                dataKey="expenses"
                data={mockExpenseData.labels.map((label, index) => ({
                  name: label,
                  expenses: mockExpenseData.expenses[index],
                }))}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {mockExpenseData.labels.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: '1' }}>
          <h3>Expense Breakdown</h3>
          <Table dataSource={expenseTableData} columns={columns} pagination={false} size="small" style={{ width: '100%' }} />
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Summary</h3>
        <p>Total Expense: ${totalExpense}</p>
        {/* You can add more textual summaries here */}
      </div>
      <div style={{ marginTop: '20px', float:'right' }}>
        <h3>Cost-Saving Opportunities</h3>
        <Table dataSource={costOpportunities} columns={columns}  pagination={false} size="small" style={{ width: '50%' }} />
      </div>
    </div>
  );
};

export default Charts;

