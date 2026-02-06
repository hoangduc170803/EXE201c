import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Mail, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { BookingResponse } from '@/types';
import { api } from '@/services/api';

interface BookingDetailModalProps {
  bookingId: number;
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdated?: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  bookingId,
  isOpen,
  onClose,
  onBookingUpdated
}) => {
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && bookingId) {
      loadBookingDetail();
    }
  }, [isOpen, bookingId]);

  const loadBookingDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getBookingById(bookingId);
      if (response.success) {
        setBooking(response.data);
      }
    } catch (error) {
      console.error('Error loading booking detail:', error);
      setError('Không thể tải thông tin đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    setCancelling(true);
    try {
      const response = await api.cancelBooking(booking.id, cancelReason || undefined);
      if (response.success) {
        setBooking(response.data);
        setShowCancelConfirm(false);
        setCancelReason('');
        if (onBookingUpdated) {
          onBookingUpdated();
        }
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Không thể hủy đặt phòng');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'COMPLETED':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const canCancelBooking = (status: string, checkInDate: string) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    return status?.toUpperCase() === 'CONFIRMED' && checkIn > now;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết đặt phòng</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : error ? (
            <div className="px-6 py-8 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadBookingDetail}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
              >
                Thử lại
              </button>
            </div>
          ) : booking ? (
            <div className="max-h-[70vh] overflow-y-auto">
              {/* Booking Status */}
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Mã đặt phòng: #{booking.bookingCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(booking.totalPrice)}</p>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <img
                    src={booking.property.primaryImageUrl}
                    alt={booking.property.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{booking.property.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.property.address}, {booking.property.city}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Users className="w-4 h-4 mr-1" />
                      {booking.numGuests} khách • {booking.property.bedrooms} phòng ngủ
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Dates */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Nhận phòng
                    </div>
                    <p className="font-medium text-gray-900">{formatDate(booking.checkInDate)}</p>
                    <p className="text-sm text-gray-600">{booking.property.checkInTime}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Trả phòng
                    </div>
                    <p className="font-medium text-gray-900">{formatDate(booking.checkOutDate)}</p>
                    <p className="text-sm text-gray-600">{booking.property.checkOutTime}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {booking.numNights} đêm
                </div>
              </div>

              {/* Guest Information */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h5 className="font-medium text-gray-900 mb-3">Thông tin khách hàng</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.guest.firstName} {booking.guest.lastName}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {booking.guest.email}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {booking.numAdults} người lớn, {booking.numChildren} trẻ em, {booking.numInfants} em bé
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h5 className="font-medium text-gray-900 mb-3">Chi tiết thanh toán</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{formatCurrency(booking.pricePerNight)} x {booking.numNights} đêm</span>
                    <span className="text-gray-900">{formatCurrency(booking.subtotal)}</span>
                  </div>
                  {booking.cleaningFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vệ sinh</span>
                      <span className="text-gray-900">{formatCurrency(booking.cleaningFee)}</span>
                    </div>
                  )}
                  {booking.serviceFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí dịch vụ</span>
                      <span className="text-gray-900">{formatCurrency(booking.serviceFee)}</span>
                    </div>
                  )}
                  {booking.taxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Thuế</span>
                      <span className="text-gray-900">{formatCurrency(booking.taxAmount)}</span>
                    </div>
                  )}
                  {booking.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="text-red-600">-{formatCurrency(booking.discountAmount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Tổng cộng (VND)</span>
                      <span>{formatCurrency(booking.totalPrice)}</span>
                    </div>
                  </div>
                </div>
                {booking.paymentMethod && (
                  <div className="mt-3 flex items-center text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Thanh toán: {booking.paymentMethod}
                  </div>
                )}
              </div>

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className="px-6 py-4 border-b border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Yêu cầu đặc biệt</h5>
                  <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                </div>
              )}

              {/* Host Information */}
              {booking.property.host && (
                <div className="px-6 py-4 border-b border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-3">Thông tin chủ nhà</h5>
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.property.host.avatarUrl}
                      alt={`${booking.property.host.firstName} ${booking.property.host.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.property.host.firstName} {booking.property.host.lastName}
                      </p>
                      {booking.property.host.isVerified && (
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Đã xác minh
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            {booking && canCancelBooking(booking.status, booking.checkInDate) ? (
              showCancelConfirm ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lý do hủy (không bắt buộc)
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                      placeholder="Nhập lý do hủy đặt phòng..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handleCancelBooking}
                      disabled={cancelling}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Hủy đặt phòng
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
