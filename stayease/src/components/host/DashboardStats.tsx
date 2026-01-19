import React from 'react';

const stats = [
  {
    label: 'Doanh thu tháng này',
    value: '45.2M',
    trend: 12.5,
    icon: 'payments',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    label: 'Tổng lượt khách',
    value: '124',
    trend: 8.2,
    icon: 'group',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    label: 'Lượt xem trang',
    value: '2.4k',
    trend: -2.4,
    icon: 'visibility',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    label: 'Đánh giá',
    value: '4.92',
    trend: 0,
    icon: 'star',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  }
];

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
            </div>
            {stat.trend !== 0 && (
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${stat.trend > 0 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-red-600 bg-red-50 dark:bg-red-500/10'}`}>
                <span className="material-symbols-outlined !text-[12px] mr-1">
                  {stat.trend > 0 ? 'trending_up' : 'trending_down'}
                </span>
                {Math.abs(stat.trend)}%
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;

