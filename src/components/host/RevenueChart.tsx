import React from 'react';

const RevenueChart: React.FC = () => {
  // Mock data for chart columns (height percentage)
  const data = [40, 65, 45, 80, 55, 70, 40, 60, 75, 50, 85, 95];
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

  return (
    <div className="h-full p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Biểu đồ doanh thu</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tổng quan năm 2024</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <div className="flex items-end justify-between h-64 gap-2 sm:gap-4 mt-4">
        {data.map((height, i) => (
          <div key={i} className="flex flex-col items-center gap-3 group w-full">
            <div className="relative w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg h-full overflow-hidden flex items-end">
              <div 
                className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-300 rounded-t-sm"
                style={{ height: `${height}%` }}
              ></div>
              
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                {height}M VND
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;

