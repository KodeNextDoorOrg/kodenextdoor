import type { Metadata } from 'next';
import './styles/template.css';

export const metadata: Metadata = {
  title: 'Tenant Portal',
  description: 'Manage your tenancy online.',
};

export default function RealEstatePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="rep-root">
        {children}
      </body>
    </html>
  );
} 