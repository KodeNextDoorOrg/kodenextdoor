"use client";

import React, { useState } from 'react';
import "@/app/templates/real-estate-portal/styles/template.css";
import { Home, FileText, Wrench, CreditCard, Bell, Settings, Calendar, Eye, Check, Clock, Download, Send, Mail, Plus, Filter } from "lucide-react";
import Link from 'next/link';
import Layout from '../components/Layout';

const MaintenancePage = () => {
  // --- Dummy Data (Replace with actual data fetching) ---
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  const maintenanceRequests = [
    { 
      id: 1, 
      title: 'Leaky Faucet - Kitchen', 
      description: 'The kitchen sink faucet is leaking from the base whenever I turn it on. Water is pooling around the sink area.',
      status: 'Open', 
      date: '2024-04-05',
      updates: [
        { date: '2024-04-05', message: 'Request submitted', type: 'status' },
        { date: '2024-04-06', message: 'Maintenance team has scheduled a visit for April 8th between 10am-12pm', type: 'response' }
      ]
    },
    { 
      id: 2, 
      title: 'AC Not Cooling', 
      description: 'The air conditioner is running but not cooling the apartment. Current indoor temperature is 82°F despite the thermostat being set to 72°F.',
      status: 'In Progress', 
      date: '2024-04-02',
      updates: [
        { date: '2024-04-02', message: 'Request submitted', type: 'status' },
        { date: '2024-04-03', message: 'Technician visited and diagnosed the issue as a refrigerant leak. Parts have been ordered.', type: 'response' },
        { date: '2024-04-04', message: 'Parts expected to arrive by April 7th. Follow-up visit scheduled for April 8th.', type: 'response' }
      ]
    },
    { 
      id: 3, 
      title: 'Window Repair', 
      description: 'The living room window has a crack in the lower right corner. It appears to have happened during the recent storm.',
      status: 'Closed', 
      date: '2024-03-28',
      updates: [
        { date: '2024-03-28', message: 'Request submitted', type: 'status' },
        { date: '2024-03-29', message: 'Maintenance team will inspect on March 30th', type: 'response' },
        { date: '2024-03-30', message: 'Window inspected, replacement glass ordered', type: 'response' },
        { date: '2024-04-02', message: 'Window has been repaired and sealed', type: 'status' },
        { date: '2024-04-02', message: 'Request closed', type: 'status' }
      ]
    },
    { 
      id: 4, 
      title: 'Bathroom Exhaust Fan', 
      description: 'The exhaust fan in the master bathroom is making a loud grinding noise when running.',
      status: 'Closed', 
      date: '2024-03-15',
      updates: [
        { date: '2024-03-15', message: 'Request submitted', type: 'status' },
        { date: '2024-03-16', message: 'Scheduled for repair on March 18th', type: 'response' },
        { date: '2024-03-18', message: 'Fan motor replaced', type: 'response' },
        { date: '2024-03-18', message: 'Request closed', type: 'status' }
      ]
    },
  ];

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'rep-status-open';
      case 'in progress': return 'rep-status-pending';
      case 'closed': case 'completed': return 'rep-status-closed';
      default: return 'rep-status-closed';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return <Clock size={14} />;
      case 'in progress':
        return <Wrench size={14} />;
      case 'closed':
      case 'completed':
        return <Check size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  return (
    <Layout>
      {/* Main Content */}
      <main className="rep-main-content">
        {/* Header */}
        <header className="rep-content-header">
          <h1>Maintenance Requests</h1>
          <div className="rep-header-user-info">
            <Bell size={20} />
            <div className="rep-user-avatar">JD</div>
            <div className="rep-user-name">Jane Doe</div>
          </div>
        </header>

        {/* Request Summary */}
        <div className="rep-metrics-card rep-fade-in">
          <div className="rep-metrics-header">
            <h2>Maintenance Overview</h2>
            <button 
              className="rep-btn rep-btn-primary"
              onClick={() => setShowRequestModal(true)}
            >
              <Plus size={16} /> New Request
            </button>
          </div>
          <div className="rep-metrics-grid">
            <div className="rep-metric-item">
              <div className="rep-metric-value">{maintenanceRequests.filter(r => r.status.toLowerCase() === 'open').length}</div>
              <div className="rep-metric-label">Open Requests</div>
            </div>
            <div className="rep-metric-item">
              <div className="rep-metric-value">{maintenanceRequests.filter(r => r.status.toLowerCase() === 'in progress').length}</div>
              <div className="rep-metric-label">In Progress</div>
            </div>
            <div className="rep-metric-item">
              <div className="rep-metric-value">{maintenanceRequests.filter(r => r.status.toLowerCase() === 'closed').length}</div>
              <div className="rep-metric-label">Completed</div>
            </div>
            <div className="rep-metric-item">
              <div className="rep-metric-value">{maintenanceRequests.length}</div>
              <div className="rep-metric-label">Total Requests</div>
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="rep-list-container rep-fade-in">
          <div className="rep-list-header">
            <h2><Wrench /> All Maintenance Requests</h2>
            <div className="flex items-center gap-2">
              <select className="bg-white border border-[--rep-border-color] rounded-md text-sm py-1 px-3">
                <option>All Requests</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
              </select>
              <button className="rep-btn rep-btn-outline py-1 px-3">
                <Filter size={16} className="mr-1" /> Filter
              </button>
            </div>
          </div>
          <ul className="rep-list">
            {maintenanceRequests.map(request => (
              <li key={request.id} className="rep-list-item" onClick={() => setSelectedRequest(request)}>
                <div className="rep-item-details">
                  <span className="rep-item-title">{request.title}</span>
                  <span className="rep-item-meta">Submitted: {request.date}</span>
                </div>
                <div className="rep-item-status">
                  <span className={getStatusClass(request.status)}>
                    {getStatusIcon(request.status)} {request.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Maintenance Tips */}
        <div className="rep-card rep-fade-in">
          <div className="rep-card-header">
            <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            Maintenance Tips
          </div>
          <div className="space-y-4 mt-2">
            <div className="bg-[--rep-primary-light] p-4 rounded-lg">
              <h3 className="font-medium text-[--rep-primary] mb-1">Preventative HVAC Maintenance</h3>
              <p className="text-sm">Change your air filters every 30-90 days to maintain optimal air flow and system efficiency.</p>
            </div>
            <div className="bg-[--rep-primary-light] p-4 rounded-lg">
              <h3 className="font-medium text-[--rep-primary] mb-1">Preventing Plumbing Issues</h3>
              <p className="text-sm">Never flush paper towels, wipes, or other non-degradable items. Only toilet paper should be flushed.</p>
            </div>
            <div className="bg-[--rep-primary-light] p-4 rounded-lg">
              <h3 className="font-medium text-[--rep-primary] mb-1">Energy Savings</h3>
              <p className="text-sm">Keep your thermostat at a consistent temperature. Recommended settings: 68-72°F in winter, 74-78°F in summer.</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="rep-card rep-fade-in mt-6 bg-[--rep-gold] bg-opacity-10">
          <div className="rep-card-header text-[--rep-gold]">
            <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            Emergency Maintenance
          </div>
          <div className="mt-2">
            <p className="mb-2">For urgent maintenance issues that pose immediate risks (major leaks, no heat in winter, etc.), please call our 24/7 emergency line:</p>
            <div className="font-bold text-xl text-center py-3">📞 (555) 123-4567</div>
            <p className="text-sm mt-2">For non-emergency requests, please use the online request system for faster tracking and resolution.</p>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default MaintenancePage; 