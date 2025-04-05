import type { Metadata } from 'next';
import './styles/template.css';

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'Advanced Dashboard Template',
};

export default function InventorySystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply base class to body */}
      <body className="is-root">
        {children}
      </body>
    </html>
  );
} 