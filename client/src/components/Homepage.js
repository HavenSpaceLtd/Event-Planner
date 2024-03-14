import React from 'react';
import {BsFillArchiveFill, BsFillBellFill, BsListCheck, BsPeopleFill}
from "react-icons/bs";

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,LineChart,Line } from 'recharts';
import AllEvents from './AllEvents';

function Homepage () {

    const data = [
        {
          name: 'Page A',
          uv: 40,
          pv: 24,
          amt: 24,
        },
        {
          name: 'Page B',
          uv: 30,
          pv: 13,
          amt: 22,
        },
        {
          name: 'Page C',
          uv: 20,
          pv: 98,
          amt: 22,
        },
        {
          name: 'Page D',
          uv: 27,
          pv: 39,
          amt: 20,
        },
      ];
    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>
            <div className='charts'>
                <ResponsiveContainer width="100%" height="90%">
                        <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                        <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                        </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height="90%">
                        <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                </ResponsiveContainer>
            </div>
        </main>
    )
}
export default Homepage;