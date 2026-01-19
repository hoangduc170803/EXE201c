import React from 'react';

const bookings = [
  {
    id: 1,
    name: 'Sarah Nguyễn',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
    property: 'Villa Đà Lạt View Đồi',
    date: '12 T5 - 15 T5',
    status: 'Sắp tới',
    statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Michael',
    property: 'Căn hộ Studio Quận 1',
    date: '10 T5 - 12 T5',
    status: 'Đang ở',
    statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
  },
  {
    id: 3,
    name: 'Lê Thu Hà',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ha',
    property: 'Homestay Hội An',
    date: '08 T5 - 10 T5',
    status: 'Hoàn tất',
    statusColor: 'text-slate-600 bg-slate-100 dark:bg-slate-800'
  },
  {
    id: 4,
    name: 'David Smith',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=David',
    property: 'Villa Đà Lạt View Đồi',
    date: '05 T5 - 08 T5',
    status: 'Hoàn tất',
    statusColor: 'text-slate-600 bg-slate-100 dark:bg-slate-800'
  },
  {
    id: 5,
    name: 'Phạm Văn Tú',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Tu',
    property: 'Căn hộ Studio Quận 1',
    date: '01 T5 - 03 T5',
    status: 'Đã hủy',
    statusColor: 'text-red-600 bg-red-50 dark:bg-red-900/20'
  }
];

const DashboardBookings: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Đặt phòng gần đây</h3>
        <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80">Xem tất cả</a>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-1 flex-1">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer">
            <img 
              src={booking.avatar} 
              alt={booking.name} 
              className="size-10 rounded-full bg-slate-100 object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{booking.name}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${booking.statusColor}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-1">{booking.property}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <span className="material-symbols-outlined !text-[12px]">calendar_month</span>
                <span>{booking.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardBookings;

