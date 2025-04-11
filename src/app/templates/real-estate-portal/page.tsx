"use client"; // Needed for potential future state/interactions

import React from 'react';
import Layout from './components/Layout';

// Placeholder Icons
const PlaceholderIcon = ({ className = "w-5 h-5", pathD }) => (
    <svg className={className} fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={pathD} /></svg>
);
const WalletIcon = () => <PlaceholderIcon pathD="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />;
const WrenchIcon = () => <PlaceholderIcon pathD="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a.563.563 0 000-.796l-1.856-1.856a.563.563 0 00-.796 0L9.239 12.1l-1.148-1.148a2.252 2.252 0 01-3.182 0L3 9m9 6l-4-4m4 4l4-4" />;

const RealEstatePortalPage = () => {
  // --- Dummy Data (Replace with actual data fetching) ---
  const rentStatus = { due: true, amount: 1250.00, dueDate: '2024-05-01' };
  const maintenanceRequests = [
    { id: 1, title: 'Leaky Faucet - Kitchen', status: 'Open', date: '2024-04-05' },
    { id: 2, title: 'AC Not Cooling', status: 'In Progress', date: '2024-04-02' },
    { id: 3, title: 'Window Repair', status: 'Closed', date: '2024-03-28' },
  ];
  const paymentHistory = [
    { id: 'P1003', date: '2024-04-01', amount: 1250.00, status: 'Paid' },
    { id: 'P1002', date: '2024-03-01', amount: 1250.00, status: 'Paid' },
    { id: 'P1001', date: '2024-02-01', amount: 1250.00, status: 'Paid' },
  ];
  const userName = "Jane Doe"; // Replace with actual user data

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'rep-status-paid';
      case 'pending': case 'processing': return 'rep-status-pending';
      case 'open': case 'in progress': return 'rep-status-open';
      case 'closed': case 'completed': return 'rep-status-closed';
      default: return 'rep-status-closed';
    }
  };

  return (
    <Layout>
      {/* Content Header */}
      <div className="rep-content-header">
        <h1>Welcome, {userName}!</h1>
        <div className="rep-header-user-info">
          <span className="rep-user-avatar">{userName.charAt(0)}</span>
          {/* Add dropdown/logout later */}
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="rep-card-grid rep-fade-in">
        {/* Rent Status Card */}
        <div className="rep-card">
          <div className="rep-card-header">Rent Status</div>
          {rentStatus.due ? (
            <>
              <div className="rep-card-value" style={{ color: 'var(--rep-danger)'}}>${rentStatus.amount.toFixed(2)} Due</div>
              <p className="text-sm text-[--rep-text-secondary]">Due on: {new Date(rentStatus.dueDate).toLocaleDateString()}</p>
              <button className="rep-btn rep-btn-primary mt-2">Pay Rent Now</button>
            </>
          ) : (
            <>
              <div className="rep-card-value" style={{ color: 'var(--rep-success)' }}>Paid</div>
              <p className="text-sm text-[--rep-text-secondary]">Next payment due soon.</p>
              <button className="rep-btn rep-btn-outline mt-2">View Payment History</button>
            </>
          )}
        </div>

        {/* Maintenance Requests Card */}
        <div className="rep-card">
          <div className="rep-card-header">Maintenance Requests</div>
          <div className="rep-card-value">{maintenanceRequests.filter(r => r.status === 'Open' || r.status === 'In Progress').length} Open</div>
          <p className="text-sm text-[--rep-text-secondary]"> {maintenanceRequests.length} Total Requests</p>
          <button className="rep-btn rep-btn-primary mt-2">New Request</button>
        </div>
      </div>

      {/* Recent Maintenance Requests List */}
      <div className="rep-list-container rep-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="rep-list-header">
          <h2>Recent Maintenance</h2>
          <button className="rep-btn rep-btn-secondary text-sm">View All</button>
        </div>
        <ul className="rep-list">
          {maintenanceRequests.slice(0, 3).map(req => (
            <li key={req.id} className="rep-list-item">
              <div className="rep-item-details">
                <span className="rep-item-title">{req.title}</span>
                <span className="rep-item-meta">Submitted: {new Date(req.date).toLocaleDateString()}</span>
              </div>
              <div className="rep-item-status">
                <span className={getStatusClass(req.status)}>{req.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Payments List */}
      <div className="rep-list-container rep-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="rep-list-header">
          <h2>Payment History</h2>
          <button className="rep-btn rep-btn-secondary text-sm">View All</button>
        </div>
        <ul className="rep-list">
          {paymentHistory.slice(0, 3).map(pay => (
            <li key={pay.id} className="rep-list-item">
              <div className="rep-item-details">
                <span className="rep-item-title">Rent Payment - {new Date(pay.date).toLocaleString('default', { month: 'long' })}</span>
                <span className="rep-item-meta">ID: {pay.id} | Paid: {new Date(pay.date).toLocaleDateString()}</span>
              </div>
              <div className="rep-item-amount font-medium">
                ${pay.amount.toFixed(2)}
              </div>
               <div className="rep-item-status">
                 <span className={getStatusClass(pay.status)}>{pay.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </Layout>
  );
};

export default RealEstatePortalPage; 