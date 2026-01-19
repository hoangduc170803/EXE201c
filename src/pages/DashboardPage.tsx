import React, { useState } from 'react';
import HostSidebar from '@/components/host/HostSidebar';
import HostHeader from '@/components/host/HostHeader';
import DashboardStats from '@/components/host/DashboardStats';
import RevenueChart from '@/components/host/RevenueChart';
import DashboardBookings from '@/components/host/DashboardBookings';
import { HOST_USER } from '@/constants';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <HostSidebar 
          user={HOST_USER} 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <HostHeader onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
              <h2 className="text-2xl font-bold">Tổng quan</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Chào mừng trở lại, {HOST_USER.name} 👋</p>
            </div>

            {/* Stats Grid */}
            <DashboardStats />

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Chart Section */}
              <div className="xl:col-span-2">
                <RevenueChart />
              </div>
              
              {/* Activity Section */}
              <div className="xl:col-span-1">
                <DashboardBookings />
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

