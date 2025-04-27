import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './Subscription.css';

// Stripe publishable key
const stripePromise = loadStripe('pk_test_51RHprRPwdPUAGbo4KwaLFj1yxuJvODuftJdDZK1RhaNozSV90f1IzoqDfS60oa5Z984dUim3ObvIVbmpo0daydHP005nBXNqtw');

const Subscription = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    setCurrentDate(today.toLocaleDateString());
    setEndDate(nextMonth.toLocaleDateString());
  }, []);

  const handleCheckout = async (plan) => {
    try {
      const res = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }) // Send plan to backend
      });

      const data = await res.json();

      if (!data.id) {
        console.error('Session ID not received:', data);
        throw new Error('Session ID not received from backend');
      }

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error('Error redirecting:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="subscription-container">
      <h1 className="subscription-title">Subscription Sign up Form</h1>
      <div className="cards-container">

        {/* Basic Card */}
        <div className="card basic">
          <div className="card-header basic-header">
            <h2>Basic</h2>
            <p className="price">$5</p>
            <p className="per-month">per month</p>
          </div>
          <div className="card-body">
            <p>Full access</p>
            <p>Documentation</p>
            <p>15 Credits Available</p>
            <p>Free Updates</p>
            <p>Unlimited Domains</p>
            <button className="signup-btn basic-btn" onClick={() => handleCheckout('basic')}>
              Sign Up
            </button>
          </div>
        </div>

        {/* Standard Card */}
        <div className="card standard">
          <div className="card-header standard-header">
            <h2>Standard</h2>
            <p className="price">$10</p>
            <p className="per-month">per month</p>
          </div>
          <div className="card-body">
            <p>Full access</p>
            <p>Documentation</p>
            <p>50 Credits Available</p>
            <p>Free Updates</p>
            <p>Unlimited Domains</p>
            <button className="signup-btn standard-btn" onClick={() => handleCheckout('standard')}>
              Sign Up
            </button>
          </div>
        </div>

        {/* Premium Card */}
        <div className="card premium">
          <div className="card-header premium-header">
            <h2>Premium</h2>
            <p className="price">$20</p>
            <p className="per-month">per month</p>
          </div>
          <div className="card-body">
            <p>Full access</p>
            <p>Documentation</p>
            <p>100 Credits Available</p>
            <p>Free Updates</p>
            <p>Unlimited Domains</p>
            <button className="signup-btn premium-btn" onClick={() => handleCheckout('premium')}>
              Sign Up
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Subscription;
