import React, { useState } from 'react';
import { Reservation } from '@/types';

const DUMMY_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    guest: {
      name: 'Nguyễn Văn A',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmipOVZKtLC_voMelsz2DxVcZUNnYb8ehQmEDkIIvu7beVJYmlOKfQQ3ehNb34DPUvRYlRIF46iHwsUWoZJM9mLQnshrDt3EpGqn94UowyMU5Ax6htZVGZznKi7tYmutfO4zfjvKiur8sm05kaZuaVvp0Zdgoq4K2BWZDnTGtTMtsfIV1_tizNaCL9jaD2rGcjNkgMyY88GR2HFcOgNWJvtiA5evKtoFh6QvrRZXvJGjGmmcv1DlYsWgNO7XTgoOujurN-mvApSWY',
      type: 'Khách mới',
      isVip: true,
      message: '"Xin chào, tôi muốn hỏi về chỗ đ..."',
    },
    property: 'Luxury Villa Dalat - Căn hộ 2PN',
    checkIn: { dayOfWeek: 'TH 10', dayOfMonth: '12' },
    checkOut: { dayOfWeek: 'TH 10', dayOfMonth: '15' },
    details: '3 đêm • 2 khách',
    price: '3,500,000 ₫',
    priceNote: 'Đã bao gồm phí dịch vụ',
    status: 'Chờ xác nhận',
  },
  {
    id: '2',
    guest: {
      name: 'Trần Thị B',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnvPvcd-sOyx22ZfPDKKAJe3HwPlWESWLdmG8BpuztKHw60rBBHzvOMckHC3Rwr9Q9RAWJKXfvUNFMs4ErzZbzeQW1cAVxSYhS-YKoRw3hsGG29zd3-EI7GXjpIxS3uHjYBprf_RABhVtcstlsExeiNITWcpZ6Touo2lembXabrQHDrzJYIemRqbI7RdDY9zQ4-EMjIfrtAID9gUkvQPO3jU5scS3sabWSv9NXJ2j0Ms1mtJEdcS9OMQyj0fVMl0JY6IS4BYn-mFc',
      type: 'Khách quen',
      isVip: true,
    },
    property: 'Sea View Apartment - Nha Trang',
    checkIn: { dayOfWeek: 'TH 11', dayOfMonth: '05' },
    checkOut: { dayOfWeek: 'TH 11', dayOfMonth: '08' },
    details: '3 đêm • 4 khách',
    price: '4,200,000 ₫',
    priceNote: 'Đã bao gồm phí dịch vụ',
    status: 'Chờ xác nhận',
  },
  {
    id: '3',
    guest: {
      name: 'Michael K.',
      avatar: null,
      initials: 'MK',
      type: 'Quốc tế',
      isVip: false,
    },
    property: 'Luxury Villa Dalat - Nguyên căn',
    checkIn: { dayOfWeek: 'TH 12', dayOfMonth: '24' },
    checkOut: { dayOfWeek: 'TH 12', dayOfMonth: '30' },
    details: '6 đêm • 6 khách',
    price: '18,000,000 ₫',
    priceNote: 'Đã bao gồm phí dịch vụ',
    status: 'Chờ xác nhận',
  },
];

const ReservationList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('new');

  const getGuestTypeColor = (type: string) => {
    switch (type) {
      case 'Khách mới':
        return 'bg-blue-100 text-blue-700';
      case 'Khách quen':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
      case 'Quốc tế':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A2633] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8 overflow-hidden">
      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-200 dark:border-slate-700 px-4 pt-2">
        <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar gap-6 md:gap-8">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center justify-center border-b-[3px] pb-3 pt-2 px-2 whitespace-nowrap transition-colors ${
              activeTab === 'new'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
            }`}
          >
            <span className="material-symbols-outlined mr-2 text-[20px]">mark_email_unread</span>
            <span className="text-sm font-bold leading-normal tracking-[0.015em]">Yêu cầu mới (3)</span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center justify-center border-b-[3px] pb-3 pt-2 px-2 whitespace-nowrap transition-colors ${
              activeTab === 'upcoming'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
            }`}
          >
            <span className="text-sm font-bold leading-normal tracking-[0.015em]">Sắp tới</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center border-b-[3px] pb-3 pt-2 px-2 whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
            }`}
          >
            <span className="text-sm font-bold leading-normal tracking-[0.015em]">Lịch sử</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center justify-center border-b-[3px] pb-3 pt-2 px-2 whitespace-nowrap transition-colors ${
              activeTab === 'calendar'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
            }`}
          >
            <span className="text-sm font-bold leading-normal tracking-[0.015em]">Lịch tình trạng</span>
          </button>
        </div>
        <div className="w-full md:w-auto py-3 md:py-2">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              className="block w-full md:w-80 rounded-lg border-none bg-slate-100 dark:bg-gray-800 py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-700 transition-all outline-none"
              placeholder="Tìm kiếm khách, mã đặt chỗ..."
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Header Row */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-gray-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="col-span-4">Thông tin khách & Chỗ ở</div>
        <div className="col-span-3">Thời gian</div>
        <div className="col-span-2">Thanh toán</div>
        <div className="col-span-3 text-right">Hành động</div>
      </div>

      {/* List Items */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {DUMMY_RESERVATIONS.map((reservation) => (
          <div key={reservation.id} className="group hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
            <div className="flex flex-col md:grid md:grid-cols-12 gap-4 px-6 py-5 items-center">
              {/* Guest & Property */}
              <div className="col-span-4 w-full flex items-start gap-4">
                <div className="relative shrink-0">
                  {reservation.guest.avatar ? (
                    <div
                      className="size-12 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${reservation.guest.avatar}')` }}
                    />
                  ) : (
                    <div className="size-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">
                      {reservation.guest.initials}
                    </div>
                  )}
                  {reservation.guest.isVip && (
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1A2633] rounded-full p-0.5 shadow-sm">
                      <span className="material-symbols-outlined text-yellow-400 text-[16px] filled">star</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{reservation.guest.name}</h3>
                    <span className={`${getGuestTypeColor(reservation.guest.type)} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                      {reservation.guest.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {reservation.property}
                  </p>
                  {reservation.guest.message && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                      <span className="material-symbols-outlined text-[14px]">chat_bubble</span>
                      <span>{reservation.guest.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="col-span-3 w-full pl-0 md:pl-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-slate-100 dark:bg-gray-700 rounded px-2 py-1 text-center min-w-[50px]">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">{reservation.checkIn.dayOfWeek}</span>
                      <span className="block text-lg font-bold text-primary leading-none">{reservation.checkIn.dayOfMonth}</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 text-sm">arrow_forward</span>
                    <div className="bg-slate-100 dark:bg-gray-700 rounded px-2 py-1 text-center min-w-[50px]">
                      <span className="block text-xs font-bold text-slate-900 dark:text-white">{reservation.checkOut.dayOfWeek}</span>
                      <span className="block text-lg font-bold text-primary leading-none">{reservation.checkOut.dayOfMonth}</span>
                    </div>
                  </div>
                  <span className="text-sm text-slate-700 dark:text-gray-300 font-medium ml-1">{reservation.details}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="col-span-2 w-full">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{reservation.price}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400">{reservation.priceNote}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-700">
                  <span className="size-1.5 rounded-full bg-orange-500"></span>
                  {reservation.status}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-3 w-full flex md:justify-end gap-2 mt-4 md:mt-0">
                <button className="flex-1 md:flex-none h-9 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Từ chối
                </button>
                <button className="flex-1 md:flex-none h-9 px-4 rounded-lg bg-primary text-white font-medium text-sm hover:bg-blue-600 shadow-sm shadow-blue-200 dark:shadow-none transition-colors">
                  Chấp nhận
                </button>
                <button
                  className="size-9 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-primary hover:border-primary transition-colors"
                  title="Nhắn tin"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-gray-800/50 px-6 py-3">
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Hiển thị <span className="font-medium text-slate-900 dark:text-white">1</span> đến{' '}
          <span className="font-medium text-slate-900 dark:text-white">3</span> trong số{' '}
          <span className="font-medium text-slate-900 dark:text-white">3</span> yêu cầu
        </p>
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            disabled
          >
            Trước
          </button>
          <button
            className="flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            disabled
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationList;

