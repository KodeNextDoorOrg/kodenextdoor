import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google'; // Import fonts used in CSS
import './styles/template.css'; // Import the template-specific styles

// Setup fonts (match the ones in template.css)
const inter = Inter({ subsets: ['latin'], variable: '--et-font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--et-font-serif' });

export const metadata: Metadata = {
  title: 'AURA Collective - E-commerce Template', // Example Title
  description: 'A cutting-edge e-commerce experience.',
};

export default function EcommerceTemplateLayout({ 
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}> {/* Apply font variables */} 
      <head>
        {/* You can add specific head tags here if needed, like favicons */}
      </head>
      <body>
        {/* The children prop will render the page.tsx content */}
        {children}
      </body>
    </html>
  );
} 