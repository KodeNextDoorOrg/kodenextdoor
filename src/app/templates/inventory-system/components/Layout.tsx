import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Add state here later if sidebar needs to be collapsible/mobile-responsive
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="is-layout">
      <Sidebar /> {/* Pass state/toggle function if needed */}
      <main className="is-main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 