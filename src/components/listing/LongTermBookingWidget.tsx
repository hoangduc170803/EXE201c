import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PropertyDto } from '@/services/api';

interface LongTermBookingWidgetProps {
  property: PropertyDto;
}

const LongTermBookingWidget: React.FC<LongTermBookingWidgetProps> = ({ property }) => {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);

  const monthlyPrice = property.pricePerMonth || 0;
  const depositMonths = property.depositMonths || 1;
  const depositAmount = monthlyPrice * depositMonths;
  const minimumLease = property.minimumLeaseMonths || 3;

  const handleContact = () => {
    setShowContactForm(true);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to messages or show success
    navigate(`/messages?propertyId=${property.id}`);
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-[100px]">
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg bg-white dark:bg-gray-800">
          {/* Price Section */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-[#0d141b] dark:text-white">
                {monthlyPrice.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-gray-600 dark:text-gray-400">/tháng</span>
            </div>
            {property.averageRating > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined filled !text-[14px]">star</span>
                <span className="font-semibold">{property.averageRating.toFixed(1)}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500 underline cursor-pointer">
                  {property.totalReviews} đánh giá
                </span>
              </div>
            )}
          </div>

          {/* Rental Details */}
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">💰 Tiền cọc</span>
              <span className="font-semibold text-[#0d141b] dark:text-white">
                {depositAmount.toLocaleString('vi-VN')}đ ({depositMonths} tháng)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">⏱️ Thời gian tối thiểu</span>
              <span className="font-semibold text-[#0d141b] dark:text-white">
                {minimumLease} tháng
              </span>
            </div>
          </div>

          {/* Utilities Cost */}
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-[#0d141b] dark:text-white mb-3">Chi phí hàng tháng</h3>
            {property.electricityCost && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">⚡ Điện</span>
                <span className="text-[#0d141b] dark:text-white">{property.electricityCost}</span>
              </div>
            )}
            {property.waterCost && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">💧 Nước</span>
                <span className="text-[#0d141b] dark:text-white">{property.waterCost}</span>
              </div>
            )}
            {property.internetCost && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">📶 Internet</span>
                <span className="text-[#0d141b] dark:text-white">{property.internetCost}</span>
              </div>
            )}
          </div>

          {/* Total First Payment */}
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-[#0d141b] dark:text-white mb-2">Chi phí ban đầu</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Tiền thuê tháng đầu</span>
              <span className="text-[#0d141b] dark:text-white">{monthlyPrice.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Tiền cọc</span>
              <span className="text-[#0d141b] dark:text-white">{depositAmount.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-[#0d141b] dark:text-white">Tổng cộng</span>
              <span className="text-[#0d141b] dark:text-white">
                {(monthlyPrice + depositAmount).toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          {/* Contact Button */}
          {!showContactForm ? (
            <button
              onClick={handleContact}
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">chat</span>
              Liên hệ chủ nhà
            </button>
          ) : (
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tin nhắn của bạn
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Xin chào, tôi quan tâm đến phòng này..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0901234567"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Gửi
                </button>
              </div>
            </form>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            Bạn sẽ không bị tính phí ngay lúc này
          </p>
        </div>
      </div>
    </div>
  );
};

export default LongTermBookingWidget;

