import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  const location = useLocation();
  
  // Pages that have their own header/layout
  const fullWidthPages = ['/auth', '/host', '/profile'];
  const isFullWidthPage = fullWidthPages.some(page => location.pathname.startsWith(page));

  if (isFullWidthPage) {
    return <Outlet />;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

