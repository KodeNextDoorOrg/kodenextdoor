import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Add state later for mobile sidebar toggle
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="rep-layout">
      {/* Pass state/toggle function later: <Sidebar isOpen={isSidebarOpen} /> */}
      <Sidebar /> 
      <main className="rep-main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 