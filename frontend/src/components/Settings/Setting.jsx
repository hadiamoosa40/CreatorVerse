import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Setting.css';

const SettingsPage = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/settings-summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="settings-container">
      <h2>Dashboard</h2>

      {/* General Stats Cards */}
      <div className="general-stats-cards">
        <div className="general-card users-card">
          Total Users<br />
          <strong>{summary.total_users}</strong>
        </div>
        <div className="general-card payments-card">
          Total Payments<br />
          <strong>{summary.total_payments}</strong>
        </div>
        <div className="general-card revenue-card">
          Total Revenue<br />
          <strong>${summary.total_revenue.toFixed(2)}</strong>
        </div>
      </div>

      {/* Subscription Plan Cards */}
      <div className="plan-subs-cards">
        <div className="plan-card plan-basic">
          Basic Subscribers<br />
          <strong>{summary.plan_subscribers.basic}</strong>
        </div>
        <div className="plan-card plan-standard">
          Standard Subscribers<br />
          <strong>{summary.plan_subscribers.standard}</strong>
        </div>
        <div className="plan-card plan-premium">
          Premium Subscribers<br />
          <strong>{summary.plan_subscribers.premium}</strong>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
