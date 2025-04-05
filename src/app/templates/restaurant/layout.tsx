import type { Metadata } from 'next';
import './styles/template.css';

export const metadata: Metadata = {
  title: 'Savory Restaurant',
  description: 'Experience culinary excellence in an elegant atmosphere',
};

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="rt-root">
        {children}
      </body>
    </html>
  );
} 