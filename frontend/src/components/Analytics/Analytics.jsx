import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import './Analytics.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

const AnalyticsPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/analytics-summary')
      .then(res => {
        console.log(res.data); // Check the response data
        setData(res.data);
      })
      .catch(err => {
        console.error("Error fetching data", err);
      });
  }, []);

  if (!data) {
    return <div>Loading analytics...</div>;
  }

  if (!data.signup_trends || !data.plan_summary) {
    return <div>No data available for the charts.</div>;
  }

  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>

      <div className="charts-wrapper">

        {/* Signup Bar Chart */}
        <div className="chart-box">
          <h3>Monthly Signups</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.signup_trends}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="signups" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Plan Bar Chart */}
        <div className="chart-box">
          <h3>Revenue by Plan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.plan_summary}>
              <XAxis dataKey="plan" />
              <YAxis />
              <Tooltip 
                formatter={(value) => {
                  if (typeof value === 'number' && !isNaN(value)) {
                    return `$${value.toFixed(2)}`; // Format to 2 decimal places
                  }
                  return "$0.00"; // Return a default value if it's not a number
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
              <Bar dataKey="subscriptions" fill="#82ca9d" name="Subscriptions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
