"use client";

import React, { useState } from 'react';
import "@/app/templates/real-estate-portal/styles/template.css";
import { 
  Home, FileText, Wrench, CreditCard, Bell, Settings, Calendar, Eye, Check, 
  Clock, Download, Send, Mail, DollarSign, ChevronRight, Landmark, MoreVertical, Plus 
} from "lucide-react";
import Link from 'next/link';
import Layout from '../components/Layout';

const RentPaymentsPage = () => {
  // --- Dummy Data (Replace with actual data fetching) ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const rentStatus = { 
    due: true, 
    amount: 1250.00, 
    dueDate: '2024-05-01',
    remaining: 5 // days
  };

  const paymentHistory = [
    { id: 'P1003', date: '2024-04-01', amount: 1250.00, status: 'Paid', method: 'Credit Card' },
    { id: 'P1002', date: '2024-03-01', amount: 1250.00, status: 'Paid', method: 'Bank Transfer' },
    { id: 'P1001', date: '2024-02-01', amount: 1250.00, status: 'Paid', method: 'Credit Card' },
    { id: 'P1000', date: '2024-01-01', amount: 1250.00, status: 'Paid', method: 'Credit Card' },
    { id: 'P999', date: '2023-12-01', amount: 1250.00, status: 'Paid', method: 'Bank Transfer' },
    { id: 'P998', date: '2023-11-01', amount: 1250.00, status: 'Paid', method: 'Credit Card' },
  ];

  const paymentMethods = [
    { id: 1, type: 'Credit Card', last4: '4242', expiry: '05/26' },
    { id: 2, type: 'Bank Account', last4: '9876', nickname: 'Primary Checking' }
  ];

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'rep-status-paid';
      case 'pending': case 'processing': return 'rep-status-pending';
      case 'due': return 'rep-status-open';
      case 'late': return 'rep-status-closed';
      default: return 'rep-status-closed';
    }
  };

  return (
    <Layout>
      {/* Main Content */}
      <main className="rep-main-content">
        {/* Header */}
        <header className="rep-content-header">
          <h1>Rent & Payments</h1>
          <div className="rep-header-user-info">
            <Bell size={20} />
            <div className="rep-user-avatar">JD</div>
            <div className="rep-user-name">Jane Doe</div>
          </div>
        </header>

        {/* Current Rent Status */}
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
                className="rep-btn rep-btn-primary w-full"
                onClick={() => setShowPaymentModal(true)}
              >
                <CreditCard size={18} /> Pay Now
              </button>
            </div>
            <div className="rep-metric-item">
              <button className="rep-btn rep-btn-outline w-full">
                <Calendar size={18} /> Set Up Autopay
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="rep-card-grid rep-fade-in">
          {/* Rent Summary */}
          <div className="rep-card">
            <div className="rep-card-header">
              <DollarSign size={18} className="mr-2" /> Rent Summary
            </div>
            <div className="space-y-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[--rep-text-secondary]">Base Rent:</span>
                <span className="font-medium">$1,200.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[--rep-text-secondary]">Parking:</span>
                <span className="font-medium">$50.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[--rep-text-secondary]">Total Monthly Rent:</span>
                <span className="font-semibold text-lg text-[--rep-primary]">$1,250.00</span>
              </div>
              <div className="pt-3 border-t border-[--rep-border-color] flex justify-between items-center">
                <span className="text-sm text-[--rep-text-secondary]">Next Due Date:</span>
                <span className="font-medium">{rentStatus.dueDate}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="rep-card">
            <div className="rep-card-header">
              <CreditCard size={18} className="mr-2" /> Payment Methods
            </div>
            <div className="space-y-3 my-4">
              {paymentMethods.map(method => (
                <div key={method.id} className="flex items-center justify-between p-3 border border-[--rep-border-color] rounded-lg hover:border-[--rep-primary] transition-colors">
                  <div className="flex items-center">
                    {method.type === 'Credit Card' ? (
                      <CreditCard size={20} className="text-[--rep-primary] mr-3 flex-shrink-0" />
                    ) : (
                      <Landmark size={20} className="text-[--rep-primary] mr-3 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium truncate">{method.type}</div>
                      <div className="text-sm text-[--rep-text-secondary] truncate">
                        {method.type === 'Credit Card' ? 
                          `●●●● ${method.last4} | Exp: ${method.expiry}` : 
                          `${method.nickname} ●●●● ${method.last4}`}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="text-[--rep-text-secondary] hover:text-[--rep-primary] p-1 rounded-full hover:bg-[--rep-primary-light] transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="rep-btn rep-btn-outline w-full">
              <Plus size={16} className="mr-2" />
              Add Payment Method
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="rep-list-container rep-fade-in">
          <div className="rep-list-header">
            <h2><CreditCard /> Payment History</h2>
            <div className="flex items-center gap-2">
              <select className="bg-white border border-[--rep-border-color] rounded-md text-sm py-1 px-3">
                <option>All Time</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
              <button className="rep-btn rep-btn-outline py-1 px-3">
                <Download size={16} className="mr-1" /> Export
              </button>
            </div>
          </div>
          <ul className="rep-list">
            {paymentHistory.map(payment => (
              <li key={payment.id} className="rep-list-item">
                <div className="rep-item-details">
                  <span className="rep-item-title">Monthly Rent</span>
                  <span className="rep-item-meta">Date: {payment.date} | Method: {payment.method}</span>
                </div>
                <div className="rep-item-amount">${payment.amount.toFixed(2)}</div>
                <div className="rep-item-status">
                  <span className={getStatusClass(payment.status)}>{payment.status}</span>
                </div>
                <button className="ml-4 text-[--rep-primary] hover:text-[--rep-secondary]">
                  <svg className="w-5 h-5" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </Layout>
  );
};

export default RentPaymentsPage; 