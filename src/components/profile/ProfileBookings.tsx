import React from 'react';
import { BookingItem } from '@/types';

const ProfileBookings: React.FC = () => {
  const bookings: BookingItem[] = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVFRz0ztAsfIX9cBj00bVCrsp071sGf4m8J0ME2IgZUjq_XVtaWP_nBx9oX3c5Cc3Fm3tvkbWwA6XM8rVsrLCoxJb0Q4o2jJopFvVRUJoLstjzBBytsVdksX5RFaF5CG4Wuktok3YBiyP3ThbBVa7IwaaNneHwwbpIinfU6t3QcZvGhiFRV1gmD23RcKbqev9iTguaqh_JyrdZb8WiRgxWCN7SQujdMzTRgmbhi18oeS-8KGxHuzqfRxRU1FaXCq5qUx99wCAizWQ",
      name: "Ocean View Resort",
      location: "Phú Quốc",
      dateRange: "12 Th5 - 15 Th5, 2024",
      duration: "3 đêm",
      status: "completed"
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTp1ano3MtLJNN6UZ5xpj6VgNqpLaC5ZlYcfdi-cHnu5Va3E2T8cwmAOujT3Qyf6Fn4QRiou4O3TK0V3DWJwBnT3yTOQ-qtVP3mUzjT-6VmuKg4NvlLpmVJrSHVFMs69IDD5fNkkFH4lDPErcg6mcwuiJlz7kmhMZfiVI6mIy_2fbQ9oXA0-q8yWDGCQLORlP2ztYItWLtV5xMhaDlvSIb1yVE2ZNikDfzLFM6tr18h2-Q48sH9JLU6cHuwo7_rhBtRwrvvs1vssA",
      name: "Hanoi Old Quarter Homestay",
      location: "Hà Nội",
      dateRange: "20 Th6 - 22 Th6, 2024",
      duration: "2 đêm",
      status: "upcoming"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e7edf3] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e7edf3] flex justify-between items-center">
        <h3 className="text-[#0d141b] text-lg font-bold">Lịch sử đặt phòng gần đây</h3>
        <a className="text-primary text-sm font-medium hover:underline" href="#">Xem tất cả</a>
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
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-10 rounded-lg bg-cover bg-center shrink-0" 
                      style={{ backgroundImage: `url("${booking.image}")` }}
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
                  {booking.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <span className="size-1.5 rounded-full bg-green-600"></span>
                      Đã hoàn thành
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      <span className="size-1.5 rounded-full bg-blue-600"></span>
                      Sắp tới
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {booking.status === 'completed' ? (
                    <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                      Đặt lại
                    </button>
                  ) : (
                    <button className="text-[#0d141b] hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                      Chi tiết
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileBookings;

