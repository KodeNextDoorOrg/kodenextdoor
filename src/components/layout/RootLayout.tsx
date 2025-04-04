'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();



  return (
    <div className="flex flex-col min-h-screen">
      {pathname === '/' && <Header />}

      <AnimatePresence mode="wait">
        <motion.main
          className={pathname === '/' ? "flex-grow pt-20" : "flex-grow"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {pathname === '/' && <Footer />}
    </div>
  );
}