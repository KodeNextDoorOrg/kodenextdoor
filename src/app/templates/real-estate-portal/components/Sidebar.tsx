import React from 'react';
import Link from 'next/link';

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

const Sidebar = () => {
  // Add state for active link later
  const activeLink = '/templates/real-estate-portal'; // Example

  const navItems = [
    { href: '/templates/real-estate-portal', label: 'Dashboard', icon: HomeIcon },
    { href: '#', label: 'Payments', icon: PaymentIcon },
    { href: '#', label: 'Maintenance', icon: WrenchIcon },
    { href: '#', label: 'Documents', icon: DocsIcon },
    { href: '#', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    // Add dynamic class later: `rep-sidebar ${isOpen ? 'is-open' : ''}`
    <aside className="rep-sidebar">
      <div className="rep-sidebar-logo">
        {/* Replace with actual Logo */}
        <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"></path></svg>
        <span>Tenant Portal</span>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={item.href === activeLink ? 'rep-active' : ''}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Optional: Help/Support Link */}
      <div className="mt-auto pt-4 border-t border-[--rep-border-color]">
        <Link href="#" className="flex items-center text-sm text-[--rep-text-secondary] hover:text-[--rep-primary]">
          <PlaceholderIcon /> 
          <span className="ml-2">Help & Support</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar; 