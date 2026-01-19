import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HostSidebar from '@/components/host/HostSidebar';
import HostHeader from '@/components/host/HostHeader';
import ReservationStats from '@/components/host/ReservationStats';
import ReservationList from '@/components/host/ReservationList';
import ReservationCalendar from '@/components/host/ReservationCalendar';
import ReservationSidebar from '@/components/host/ReservationSidebar';
import { HOST_USER } from '@/constants';

const ReservationsPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden page-transition">
      
      <HostSidebar 
        user={HOST_USER} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <HostHeader onMenuToggle={() => setMobileMenuOpen(true)} />

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-6">
            
            {/* Breadcrumbs */}
            <nav className="flex text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/host" className="hover:text-primary transition-colors">Host Portal</Link>
              <span className="mx-2">/</span>
              <span className="text-slate-900 dark:text-white">Reservations</span>
            </nav>

            {/* Page Heading */}
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                  Quản lý Đặt chỗ
                </h1>
                <p className="text-slate-500 dark:text-gray-400 text-base font-normal leading-normal">
                  Xem và quản lý các yêu cầu đặt phòng của bạn từ một nơi duy nhất.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-[#1A2633] border border-gray-300 dark:border-gray-700 text-slate-900 dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <span className="material-symbols-outlined mr-2 text-lg">download</span>
                  Xuất báo cáo
                </button>
              </div>
            </div>

            <ReservationStats />
            
            <ReservationList />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ReservationCalendar />
              </div>
              <div className="lg:col-span-1">
                <ReservationSidebar />
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-6 py-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                <p>© 2024 StayEase Host Portal. All rights reserved.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationsPage;

