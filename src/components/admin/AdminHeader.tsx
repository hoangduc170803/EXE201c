import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, ArrowLeft, Shield } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className="hidden sm:inline">HolaRent <span className="text-primary">Admin</span></span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2">
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/admin/dashboard'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/admin/payment-settings"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/admin/payment-settings'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Cài đặt thanh toán
              </Link>
            </nav>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-white border border-transparent hover:border-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all shadow-sm"
              title="Thoát chế độ quản trị"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Về trang chủ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

