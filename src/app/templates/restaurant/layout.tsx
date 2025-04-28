import type { Metadata } from 'next';
import './styles/medalina.css';

export const metadata: Metadata = {
  title: 'Medalina - Craft BBQ',
  description: 'Serving up DC\'s best blend of classic BBQ traditions and elevated flavors.',
};

export default function MedalinaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="medalina-root">
        {children}
      </body>
    </html>
  );
} 