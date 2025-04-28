import React from 'react';
import Link from 'next/link';
import { Home, CreditCard, Wrench, FileText, Mail, Bell, Settings } from "lucide-react";

// Placeholder Icons (replace with actual icons)
const PlaceholderIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);
const HomeIcon = () => <PlaceholderIcon />; // Replace pathD
const PaymentIcon = () => <PlaceholderIcon />; // Replace pathD
const WrenchIcon = () => <PlaceholderIcon />; // Replace pathD
const DocsIcon = () => <PlaceholderIcon />; // Replace pathD
const SettingsIcon = () => <PlaceholderIcon />; // Replace pathD
const MessageIcon = () => <PlaceholderIcon />; // Replace pathD

interface SidebarProps {
  activePath?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePath = '' }) => {
  return (
    <aside className="rep-sidebar">
      <div className="rep-sidebar-logo">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 5.72l-4.6-2.86-7.4 6.57-7.4-6.57-2.6 1.61v13.38l2.6 1.61 7.4-6.57 7.4 6.57 4.6-2.86v-10.88z" fill="currentColor" />
        </svg>
        <span>Tenant Portal</span>
      </div>
      <nav>
        <ul>
          <li><Link href="/templates/real-estate-portal" className={activePath === '/templates/real-estate-portal' ? "rep-active flex items-center" : "flex items-center"}><Home /> Dashboard</Link></li>
          <li><Link href="/templates/real-estate-portal/rent-payments" className={activePath === '/templates/real-estate-portal/rent-payments' ? "rep-active flex items-center" : "flex items-center"}><CreditCard /> Rent & Payments</Link></li>
          <li><Link href="/templates/real-estate-portal/maintenance" className={activePath === '/templates/real-estate-portal/maintenance' ? "rep-active flex items-center" : "flex items-center"}><Wrench /> Maintenance</Link></li>
          <li><Link href="/templates/real-estate-portal/documents" className={activePath === '/templates/real-estate-portal/documents' ? "rep-active flex items-center" : "flex items-center"}><FileText /> Lease & Documents</Link></li>
          <li><Link href="/templates/real-estate-portal/messages" className={activePath === '/templates/real-estate-portal/messages' ? "rep-active flex items-center" : "flex items-center"}><Mail /> Messages</Link></li>
          <li><Link href="/templates/real-estate-portal/notifications" className={activePath === '/templates/real-estate-portal/notifications' ? "rep-active flex items-center" : "flex items-center"}><Bell /> Notifications</Link></li>
          <li><Link href="/templates/real-estate-portal/settings" className={activePath === '/templates/real-estate-portal/settings' ? "rep-active flex items-center" : "flex items-center"}><Settings /> Account Settings</Link></li>
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-[--rep-border-color]">
        <a href="#" className="flex items-center text-sm text-[--rep-text-sidebar] hover:text-[--rep-text-sidebar-active]">
          <svg className="w-5 h-5 mr-2" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          <span>Help & Support</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar; 