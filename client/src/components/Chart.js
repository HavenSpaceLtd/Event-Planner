import React from 'react';
import { Pie } from 'react-chartjs-2';

const Chart = ({ expenses }) => {
  const labels = expenses.map((expense) => expense.category);
  const amounts = expenses.map((expense) => expense.amount);

  const data = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: amounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  return <Pie data={data} />;
};

export default Chart;
