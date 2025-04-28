import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/template.css';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`rep-root ${inter.className}`}>
        {children}
      </body>
    </html>
  );
} 