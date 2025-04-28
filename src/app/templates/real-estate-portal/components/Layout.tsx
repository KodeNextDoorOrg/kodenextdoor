import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="rep-root">
      <div className="rep-layout">
        <Sidebar activePath={pathname} />
        {children}
      </div>
    </div>
  );
};

export default Layout; 