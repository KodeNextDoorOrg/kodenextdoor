"use client";

// Add "use client" if you need client-side interactions like state for sidebar toggle
// "use client"; 

import React, { useEffect } from 'react';
import Layout from './components/Layout';

// Placeholder Icons (can be shared or moved to a dedicated icons file)
const PlaceholderIcon = ({ className = "w-6 h-6", pathD = "M4 6h16M4 12h16m-7 6h7" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={pathD} />
    </svg>
);
const ChartIcon = () => <PlaceholderIcon pathD="M3 13.172a4 4 0 015.656 0L12 16.586l3.344-3.414a4 4 0 115.656 5.656l-8.485 8.485a1 1 0 01-1.414 0L3 13.172z" />;
const UsersIcon = () => <PlaceholderIcon pathD="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />;
const CurrencyIcon = () => <PlaceholderIcon pathD="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0c-1.657 0-3-.895-3-2s1.343-2 3-2 3-.895 3-2-1.343-2-3-2m0 8c-1.11 0-2.08-.402-2.599-1M12 16v1m0-1v-8" />;
const BoxIcon = () => <PlaceholderIcon pathD="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7l8 4.5L20 7" />;
const BellIcon = () => <PlaceholderIcon pathD="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />;
const UserCircleIcon = () => <PlaceholderIcon pathD="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;

const InventorySystemPage = () => {

  // Effect to trigger animations on mount (can be removed if IntersectionObserver is robust)
  useEffect(() => {
    // Simple way to trigger animations after mount
    const timer = setTimeout(() => {
        document.querySelectorAll('.is-widget, .is-chart-container, .is-table-container').forEach(el => {
            el.classList.add('is-animate-in');
        });
    }, 100); // Small delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {/* Content Header */}
      <div className="is-content-header">
        <h1>Dashboard</h1>
        <div className="is-header-actions">
          {/* Add functional Search, Notifications, Profile later */}
          <div className="is-header-search">
            <input type="search" placeholder="Search..." />
          </div>
          <button className="is-header-notifications" aria-label="Notifications">
            <BellIcon />
          </button>
          <button className="is-header-profile" aria-label="User Profile">
            <UserCircleIcon />
          </button>
           <button className="is-btn is-btn-primary">
            <PlaceholderIcon className="w-4 h-4 mr-2" pathD="M12 4v16m8-8H4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className="is-widget-grid">
        {/* Widget 1: Total Revenue */}
        <div className="is-widget" style={{ transitionDelay: '50ms' }}>
          <div className="is-widget-header">
            <span className="is-widget-title">Total Revenue</span>
            <span className="is-widget-icon"><CurrencyIcon /></span>
          </div>
          <div className="is-widget-value">$45,231.89</div>
          <div className="is-widget-change positive">
             <PlaceholderIcon pathD="M13 7l5 5m0 0l-5 5m5-5H6" /> +20.1% from last month
          </div>
        </div>

        {/* Widget 2: Total Orders */}
        <div className="is-widget" style={{ transitionDelay: '100ms' }}>
          <div className="is-widget-header">
            <span className="is-widget-title">Total Orders</span>
            <span className="is-widget-icon"><BoxIcon /></span>
          </div>
          <div className="is-widget-value">+1,234</div>
          <div className="is-widget-change positive">
             <PlaceholderIcon pathD="M13 7l5 5m0 0l-5 5m5-5H6" /> +15.2% from last month
          </div>
        </div>

        {/* Widget 3: Active Customers */}
        <div className="is-widget" style={{ transitionDelay: '150ms' }}>
          <div className="is-widget-header">
            <span className="is-widget-title">Active Customers</span>
            <span className="is-widget-icon"><UsersIcon /></span>
          </div>
          <div className="is-widget-value">+860</div>
          <div className="is-widget-change negative">
             <PlaceholderIcon pathD="M13 17l5-5m0 0l-5-5m5 5H6" /> -2.5% from last month
          </div>
        </div>

         {/* Widget 4: Low Stock Items */}
        <div className="is-widget" style={{ transitionDelay: '200ms' }}>
          <div className="is-widget-header">
            <span className="is-widget-title">Low Stock Items</span>
            <span className="is-widget-icon"><PlaceholderIcon pathD="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></span>
          </div>
          <div className="is-widget-value">15</div>
          <div className="is-widget-change">Needs attention</div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="is-chart-container">
        <span>Sales Overview Chart Placeholder</span>
      </div>

      {/* Data Table Placeholder */}
      <div className="is-table-container">
        <h3 className="text-lg font-semibold p-4">Recent Orders</h3>
        <table className="is-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example Rows */} 
            <tr>
              <td>#12345</td>
              <td>John Doe</td>
              <td>2024-04-06</td>
              <td><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Shipped</span></td>
              <td className="text-right">$150.00</td>
              <td><button className="is-btn is-btn-secondary text-xs !py-1 !px-2">View</button></td>
            </tr>
            <tr>
              <td>#12346</td>
              <td>Jane Smith</td>
              <td>2024-04-06</td>
              <td><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Processing</span></td>
              <td className="text-right">$89.50</td>
              <td><button className="is-btn is-btn-secondary text-xs !py-1 !px-2">View</button></td>
            </tr>
             <tr>
              <td>#12347</td>
              <td>Alice Brown</td>
              <td>2024-04-05</td>
              <td><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span></td>
              <td className="text-right">$210.25</td>
              <td><button className="is-btn is-btn-secondary text-xs !py-1 !px-2">View</button></td>
            </tr>
             {/* Add more rows */} 
          </tbody>
        </table>
      </div>

    </Layout>
  );
};

export default InventorySystemPage; 