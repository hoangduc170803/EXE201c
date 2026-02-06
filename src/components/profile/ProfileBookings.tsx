import React, { useState } from 'react';
import { BookingItem } from '@/types';
import BookingDetailModal from './BookingDetailModal';

interface ProfileBookingsProps {
  bookings: BookingItem[];
  onBookingUpdated?: () => void;
}

const ProfileBookings: React.FC<ProfileBookingsProps> = ({ bookings, onBookingUpdated }) => {
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBookingId(null);
  };

  const handleBookingUpdated = () => {
    if (onBookingUpdated) {
      onBookingUpdated();
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[#e7edf3] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e7edf3] flex justify-between items-center">
          <h3 className="text-[#0d141b] text-lg font-bold">Lịch sử đặt phòng</h3>
        </div>
        <div className="p-6 text-center">
          <p className="text-slate-500">Bạn chưa có đặt phòng nào.</p>
          <a
            href="/"
            className="inline-block mt-3 text-primary hover:underline font-medium"
          >
            Khám phá chỗ ở ngay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e7edf3] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e7edf3] flex justify-between items-center">
        <h3 className="text-[#0d141b] text-lg font-bold">Lịch sử đặt phòng gần đây</h3>
        {bookings.length > 5 && (
          <a className="text-primary text-sm font-medium hover:underline" href="#">Xem tất cả</a>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[#4c739a] text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Chỗ ở</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.slice(0, 5).map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-10 rounded-lg bg-cover bg-center shrink-0" 
                      style={{
                        backgroundImage: `url("${booking.image}")`,
                        backgroundColor: '#f1f5f9'
                      }}
                    ></div>
                    <div>
                      <p className="font-semibold text-[#0d141b] text-sm">{booking.name}</p>
                      <p className="text-xs text-slate-500">{booking.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-[#0d141b]">{booking.dateRange}</p>
                  <p className="text-xs text-slate-500">{booking.duration}</p>
                </td>
                <td className="px-6 py-4">
                  {booking.status === 'COMPLETED' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <span className="size-1.5 rounded-full bg-green-600"></span>
                      Đã hoàn thành
                    </span>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      <span className="size-1.5 rounded-full bg-emerald-600"></span>
                      Đã xác nhận
                    </span>
                  )}
                  {booking.status === 'PENDING' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      <span className="size-1.5 rounded-full bg-orange-600"></span>
                      Chờ xác nhận
                    </span>
                  )}
                  {booking.status === 'CANCELLED' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      <span className="size-1.5 rounded-full bg-red-600"></span>
                      Đã hủy
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {booking.status === 'CANCELLED' ? (
                    <button
                      onClick={() => {
                        // Navigate to property page for rebooking
                        window.location.href = `/`;
                      }}
                      className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      Đặt lại
                    </button>
                  ) : (
                    <button
                      onClick={() => handleViewDetails(booking.id)}
                      className="text-[#0d141b] hover:bg-amber-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      Chi tiết
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Detail Modal */}
      {selectedBookingId && (
        <BookingDetailModal
          bookingId={selectedBookingId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onBookingUpdated={handleBookingUpdated}
        />
      )}
    </div>
  );
};

export default ProfileBookings;

