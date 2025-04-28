"use client"; // Needed for potential future state/interactions

import React, { useState } from 'react';
import "@/app/templates/real-estate-portal/styles/template.css";
import { Home, FileText, Wrench, CreditCard, Bell, Settings, Calendar, Eye, Check, Clock, Download, Send, Mail } from "lucide-react";
import Link from 'next/link';
import Layout from './components/Layout';

const TenantPortalPage = () => {
  // --- Dummy Data (Replace with actual data fetching) ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const rentStatus = { 
    due: true, 
    amount: 1250.00, 
    dueDate: '2024-05-01',
    remaining: 5 // days
  };
  
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
  
  const leaseInfo = {
    startDate: '2023-05-01',
    endDate: '2024-04-30',
    property: '507 Marina Tower, Apt 302',
    landlord: 'Luxe Property Management',
    contact: 'support@luxeproperty.com'
  };

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
      {/* Main Content */}
      <main className="rep-main-content">
        {/* Header */}
        <header className="rep-content-header">
          <h1>My Dashboard</h1>
          <div className="rep-header-user-info">
            <Bell size={20} />
            <div className="rep-user-avatar">JD</div>
            <div className="rep-user-name">Jane Doe</div>
          </div>
        </header>

        {/* Rent Due Card */}
        <div className="rep-metrics-card rep-fade-in">
          <div className="rep-metrics-header">
            <h2>{rentStatus.due ? 'Rent Due Soon' : 'Rent Status'}</h2>
            <div className="rep-header-date">
              <Calendar size={16} /> Due Date: {rentStatus.dueDate}
            </div>
          </div>
          <div className="rep-metrics-grid">
            <div className="rep-metric-item">
              <div className="rep-metric-value">${rentStatus.amount}</div>
              <div className="rep-metric-label">Current Rent</div>
            </div>
            {rentStatus.due && (
              <div className="rep-metric-item">
                <div className="rep-metric-value">{rentStatus.remaining} days</div>
                <div className="rep-metric-label">Until Due Date</div>
              </div>
            )}
            <div className="rep-metric-item">
              <button 
                className="rep-btn rep-btn-secondary w-full"
                onClick={() => setShowPaymentModal(true)}
              >
                <CreditCard size={18} /> Pay Now
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="rep-card-grid rep-fade-in">
          <div className="rep-card">
            <div className="rep-card-header">
              <CreditCard /> Lease Information
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-[--rep-text-secondary]">Property:</span>
                <span className="font-medium">{leaseInfo.property}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[--rep-text-secondary]">Start Date:</span>
                <span className="font-medium">{leaseInfo.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[--rep-text-secondary]">End Date:</span>
                <span className="font-medium">{leaseInfo.endDate}</span>
              </div>
            </div>
            <button className="rep-btn rep-btn-outline w-full">
              <Download size={16} /> Download Lease
            </button>
          </div>
          
          <div className="rep-card">
            <div className="rep-card-header">
              <Wrench /> Maintenance Requests
            </div>
            <div className="rep-card-value">{maintenanceRequests.filter(r => r.status.toLowerCase() !== 'closed').length}</div>
            <span className="rep-item-status">
              <span className="rep-status-open">Active Requests</span>
            </span>
            <button 
              className="rep-btn rep-btn-primary w-full mt-4"
              onClick={() => setShowRequestModal(true)}
            >
              <Send size={16} /> New Request
            </button>
          </div>
          
          <div className="rep-card">
            <div className="rep-card-header">
              <Mail /> Messages
            </div>
            <div className="rep-card-value">2</div>
            <span className="rep-item-status">
              <span className="rep-status-pending">Unread Messages</span>
            </span>
            <button className="rep-btn rep-btn-outline w-full mt-4">
              <Eye size={16} /> View Messages
            </button>
          </div>
        </div>

        {/* Maintenance Requests */}
        <div className="rep-list-container rep-fade-in">
          <div className="rep-list-header">
            <h2><Wrench /> Recent Maintenance Requests</h2>
            <button className="rep-btn rep-btn-outline">
              <Eye size={16} /> View All
            </button>
          </div>
          <ul className="rep-list">
            {maintenanceRequests.map(request => (
              <li key={request.id} className="rep-list-item">
                <div className="rep-item-details">
                  <span className="rep-item-title">{request.title}</span>
                  <span className="rep-item-meta">Submitted: {request.date}</span>
                </div>
                <div className="rep-item-status">
                  <span className={getStatusClass(request.status)}>{request.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment History */}
        <div className="rep-list-container rep-fade-in">
          <div className="rep-list-header">
            <h2><CreditCard /> Recent Payments</h2>
            <button className="rep-btn rep-btn-outline">
              <Eye size={16} /> Payment History
            </button>
          </div>
          <ul className="rep-list">
            {paymentHistory.map(payment => (
              <li key={payment.id} className="rep-list-item">
                <div className="rep-item-details">
                  <span className="rep-item-title">Monthly Rent</span>
                  <span className="rep-item-meta">Date: {payment.date}</span>
                </div>
                <div className="rep-item-amount">${payment.amount.toFixed(2)}</div>
                <div className="rep-item-status">
                  <span className={getStatusClass(payment.status)}>{payment.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="rep-card-grid" style={{ marginBottom: '2rem' }}>
          <button className="rep-btn rep-btn-primary">
            <Wrench size={18} /> Report an Issue
          </button>
          <button className="rep-btn rep-btn-secondary">
            <Mail size={18} /> Contact Management
          </button>
          <button className="rep-btn rep-btn-outline">
            <FileText size={18} /> View Documents
          </button>
        </div>
      </main>
    </Layout>
  );
};

export default TenantPortalPage; 