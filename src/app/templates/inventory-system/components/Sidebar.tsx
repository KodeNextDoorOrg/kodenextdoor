import React from 'react';
import Link from 'next/link';

// Placeholder Icons (replace with actual icons, e.g., from react-icons)
const PlaceholderIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const Sidebar = () => {
  // Add state for active link later if needed
  const activeLink = '/templates/inventory-system'; // Example

  const navItems = [
    { href: '/templates/inventory-system', label: 'Dashboard', icon: PlaceholderIcon },
    { href: '#', label: 'Products', icon: PlaceholderIcon },
    { href: '#', label: 'Orders', icon: PlaceholderIcon },
    { href: '#', label: 'Customers', icon: PlaceholderIcon },
    { href: '#', label: 'Reports', icon: PlaceholderIcon },
    { href: '#', label: 'Settings', icon: PlaceholderIcon },
  ];

  return (
    <aside className="is-sidebar">
      <div className="is-sidebar-logo">
        {/* Replace with actual Logo SVG or Image */}
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        <span>InvSys</span>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={item.href === activeLink ? 'is-active' : ''}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Optional: Add user profile/logout at bottom */}
    </aside>
  );
};

export default Sidebar; 