import React from 'react';

const ReservationStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Card 1 */}
      <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1A2633] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <p className="text-slate-500 dark:text-gray-400 text-sm font-medium leading-normal uppercase tracking-wider">
            Yêu cầu chờ duyệt
          </p>
          <span className="material-symbols-outlined text-orange-500">pending_actions</span>
        </div>
        <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mt-2">3</p>
        <p className="text-xs text-orange-600 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded w-fit mt-1">
          Cần xử lý ngay
        </p>
      </div>

      {/* Card 2 */}
      <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1A2633] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <p className="text-slate-500 dark:text-gray-400 text-sm font-medium leading-normal uppercase tracking-wider">
            Đã xác nhận tháng này
          </p>
          <span className="material-symbols-outlined text-primary">check_circle</span>
        </div>
        <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mt-2">12</p>
        <p className="text-xs text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded w-fit mt-1">
          +2 so với tháng trước
        </p>
      </div>

      {/* Card 3 */}
      <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1A2633] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <p className="text-slate-500 dark:text-gray-400 text-sm font-medium leading-normal uppercase tracking-wider">
            Doanh thu dự kiến
          </p>
          <span className="material-symbols-outlined text-green-500">payments</span>
        </div>
        <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mt-2">
          45.2tr ₫
        </p>
        <p className="text-xs text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit mt-1">
          Sắp nhận: 8.5tr ₫
        </p>
      </div>
    </div>
  );
};

export default ReservationStats;

