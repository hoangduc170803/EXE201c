import React from 'react';

const ReservationCalendar: React.FC = () => {
  const days = [
    { day: '29', month: 'prev', content: null },
    { day: '30', month: 'prev', content: null },
    { day: '1', month: 'curr', content: null },
    { day: '2', month: 'curr', content: { type: 'checked-in', label: 'Checked In' } },
    { day: '3', month: 'curr', content: { type: 'checked-in', label: 'Checked In' } },
    { day: '4', month: 'curr', content: null },
    { day: '5', month: 'curr', content: null },
    { day: '6', month: 'curr', content: null },
    { day: '7', month: 'curr', content: null },
    { day: '8', month: 'curr', content: null },
    { day: '9', month: 'curr', content: null },
    { day: '10', month: 'curr', content: null },
    { day: '11', month: 'curr', content: null },
    { day: '12', month: 'curr', content: { type: 'guest', name: 'Nguyễn Văn A' } },
    { day: '13', month: 'curr', content: { type: 'guest', name: 'Nguyễn Văn A' } },
    { day: '14', month: 'curr', content: { type: 'guest', name: 'Nguyễn Văn A' } },
    { day: '15', month: 'curr', content: { type: 'guest', name: 'Nguyễn Văn A' } },
  ];

  return (
    <div className="bg-white dark:bg-[#1A2633] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lịch đặt phòng - Tháng 10</h3>
        <a href="#" className="text-sm font-bold text-primary hover:text-blue-700 transition-colors">
          Xem toàn bộ lịch
        </a>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-gray-700 rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700">
        {/* Header */}
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
          <div key={d} className="bg-slate-50 dark:bg-gray-800 p-2 text-center text-xs font-bold text-slate-500 uppercase">
            {d}
          </div>
        ))}

        {/* Days */}
        {days.map((d, i) => (
          <div key={i} className="bg-white dark:bg-[#1A2633] h-24 p-2 relative group hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
            <span className={`text-sm ${d.month === 'prev' ? 'text-gray-400' : 'text-slate-900 font-medium dark:text-white'}`}>
              {d.day}
            </span>
            
            {d.content?.type === 'checked-in' && (
              <div className="absolute bottom-1 left-1 right-1 bg-green-100 text-green-800 text-[10px] font-bold px-1 py-0.5 rounded truncate">
                {d.content.label}
              </div>
            )}

            {d.content?.type === 'guest' && (
              <>
                <div className="absolute top-1 right-1 size-2 rounded-full bg-orange-500"></div>
                <div className="absolute bottom-1 left-1 right-1 bg-orange-100 text-orange-800 text-[10px] font-bold px-1 py-0.5 rounded truncate border-l-2 border-orange-500">
                  {d.content.name}
                </div>
              </>
            )}
          </div>
        ))}
        {/* Fill remaining cells */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-white dark:bg-[#1A2633] h-24 p-2 group hover:bg-slate-50 dark:hover:bg-gray-800"></div>
        ))}
      </div>
    </div>
  );
};

export default ReservationCalendar;

