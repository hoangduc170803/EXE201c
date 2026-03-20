import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { BookingResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const ReservationList: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dueBookingIds, setDueBookingIds] = useState<Set<number>>(new Set());
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showGuestDetailsModal, setShowGuestDetailsModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  // Filters (client-side MVP)
  const [searchText, setSearchText] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [settlementFilter, setSettlementFilter] = useState<'ALL' | 'UNPAID' | 'RECONCILE' | 'DUE' | 'NOT_DUE'>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [sortBy, setSortBy] = useState<'CREATED_DESC' | 'CHECKIN_ASC' | 'CHECKOUT_ASC' | 'AMOUNT_DESC'>('CREATED_DESC');
  const [checkInFrom, setCheckInFrom] = useState<string>('');
  const [checkInTo, setCheckInTo] = useState<string>('');

  // Pagination (client-side MVP)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // UI: filter detail panel
  const [showFilterDetail, setShowFilterDetail] = useState(false);

  const resetFilters = () => {
    setSearchText('');
    setBookingStatusFilter('ALL');
    setSettlementFilter('ALL');
    setPaymentStatusFilter('ALL');
    setSortBy('CREATED_DESC');
    setCheckInFrom('');
    setCheckInTo('');
    setPage(1);
  };

  useEffect(() => {
    // Reset to first page when filters change
    setPage(1);
  }, [searchText, bookingStatusFilter, settlementFilter, paymentStatusFilter, sortBy, checkInFrom, checkInTo, pageSize]);

  useEffect(() => {
    console.log('Current user:', user);
    console.log('User roles:', user?.roles);
    console.log('Is host:', user?.isHost);

    // Only load bookings if user exists and has proper permissions
    if (user && (user.isHost || user.roles?.includes('ROLE_HOST'))) {
      loadBookings();
    } else if (user) {
      setLoading(false);
      setError('Bạn cần có quyền host để xem danh sách đặt chỗ. Vui lòng đăng ký làm host trước.');
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading host bookings...');

      // Check authentication
      const token = localStorage.getItem('token');
      console.log('Auth token exists:', !!token);

      const response = await api.getHostBookings(0, 50);
      console.log('Host bookings response:', response);
      console.log('Response status:', response.success);
      console.log('Response data:', response.data);

      if (response.success && response.data) {
        console.log('Bookings loaded:', response.data.content);
        console.log('Number of bookings:', response.data.content?.length || 0);
        setBookings(response.data.content || []);

        // Settlement status (money eligibility) - independent from booking status.
        // If the API isn't available yet, we fallback silently.
        try {
          const dueRes = await api.getHostSettlementDueItems();
          if (dueRes.success && Array.isArray(dueRes.data)) {
            setDueBookingIds(new Set(dueRes.data.map((x: any) => Number(x.bookingId))));
          }
        } catch {
          // ignore
        }
      } else {
        console.error('Failed to load bookings - response not successful:', response);
        const errorMsg = response.message || 'Không thể tải danh sách đặt chỗ. Vui lòng thử lại.';
        setError(errorMsg);
      }
    } catch (error: any) {
      console.error('Failed to load bookings:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });

      let errorMsg = 'Đã xảy ra lỗi khi tải danh sách đặt chỗ.';
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        errorMsg = 'Vui lòng đăng nhập lại để xem danh sách đặt chỗ.';
      } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        errorMsg = 'Bạn không có quyền truy cập. Vui lòng đảm bảo tài khoản của bạn có quyền host.';
      } else if (error.message?.includes('Network')) {
        errorMsg = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getSettlementBadge = (booking: BookingResponse) => {
    if (booking.paymentStatus !== 'PAID') {
      return {
        text: 'Chưa thanh toán',
        className: 'bg-gray-100 text-gray-800',
        tooltip: 'Khách chưa hoàn tất thanh toán. Nền tảng chỉ chi trả cho host sau khi booking đã được xác nhận thanh toán và đến hạn settlement.'
      };
    }

    // Paid, but admin has not confirmed/reconciled payment yet (no commission/payout snapshot)
    if (booking.hostPayoutAmountVnd == null) {
      return {
        text: 'Chờ đối soát',
        className: 'bg-slate-100 text-slate-800',
        tooltip: 'Khách đã chuyển khoản và/hoặc upload biên lai, nhưng admin chưa đối soát sao kê để xác nhận thanh toán.'
      };
    }
    if (dueBookingIds.has(Number(booking.id))) {
      return {
        text: 'Đến hạn nhận',
        className: 'bg-emerald-100 text-emerald-800',
        tooltip: 'Booking đã đến hạn chi trả theo quy tắc settlement. Admin sẽ thực hiện payout thủ công và cập nhật trạng thái chi trả.'
      };
    }
    return {
      text: 'Chờ đến hạn',
      className: 'bg-amber-100 text-amber-800',
      tooltip: 'Booking đã được xác nhận thanh toán nhưng chưa đến hạn chi trả theo quy tắc settlement.'
    };
  };

  const matchesSettlementFilter = (booking: BookingResponse) => {
    const isPaid = booking.paymentStatus === 'PAID';
    const hasSnapshot = booking.hostPayoutAmountVnd != null;
    const isDue = dueBookingIds.has(Number(booking.id));

    switch (settlementFilter) {
      case 'UNPAID':
        return !isPaid;
      case 'RECONCILE':
        return isPaid && !hasSnapshot;
      case 'DUE':
        return isPaid && hasSnapshot && isDue;
      case 'NOT_DUE':
        return isPaid && hasSnapshot && !isDue;
      case 'ALL':
      default:
        return true;
    }
  };

  const getSearchTarget = (booking: BookingResponse) => {
    const guestName = `${booking.guest?.firstName || ''} ${booking.guest?.lastName || ''}`.trim();
    const propertyTitle = booking.property?.title || '';
    const bookingCode = booking.bookingCode || '';
    const transferRef = booking.transferReference || '';
    return `${guestName} ${propertyTitle} ${bookingCode} ${transferRef}`.toLowerCase();
  };

  const getFilteredBookings = () => {
    const q = searchText.trim().toLowerCase();
    let list = [...bookings];

    if (q) {
      list = list.filter(b => getSearchTarget(b).includes(q));
    }

    if (bookingStatusFilter !== 'ALL') {
      list = list.filter(b => b.status === bookingStatusFilter);
    }

    if (paymentStatusFilter !== 'ALL') {
      list = list.filter(b => b.paymentStatus === paymentStatusFilter);
    }

    if (settlementFilter !== 'ALL') {
      list = list.filter(matchesSettlementFilter);
    }

    // Check-in date range filter
    if (checkInFrom) {
      const from = new Date(checkInFrom);
      if (!Number.isNaN(from.getTime())) {
        list = list.filter(b => new Date(b.checkInDate) >= from);
      }
    }
    if (checkInTo) {
      const to = new Date(checkInTo);
      if (!Number.isNaN(to.getTime())) {
        // inclusive by day
        to.setHours(23, 59, 59, 999);
        list = list.filter(b => new Date(b.checkInDate) <= to);
      }
    }

    const toTime = (s: string) => {
      const t = new Date(s).getTime();
      return Number.isFinite(t) ? t : 0;
    };

    if (sortBy === 'CHECKIN_ASC') {
      list.sort((a, b) => toTime(a.checkInDate) - toTime(b.checkInDate));
    } else if (sortBy === 'CHECKOUT_ASC') {
      list.sort((a, b) => toTime(a.checkOutDate) - toTime(b.checkOutDate));
    } else if (sortBy === 'AMOUNT_DESC') {
      list.sort((a, b) => Number(b.hostPayoutAmountVnd ?? b.totalPrice ?? 0) - Number(a.hostPayoutAmountVnd ?? a.totalPrice ?? 0));
    } else {
      // CREATED_DESC fallback
      list.sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt));
    }

    return list;
  };

  const filteredBookings = getFilteredBookings();
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedBookings = filteredBookings.slice(startIndex, startIndex + pageSize);

  const applyQuickChip = (chip: 'NEED_CONFIRM' | 'RECONCILE' | 'DUE') => {
    if (chip === 'NEED_CONFIRM') {
      setBookingStatusFilter('PENDING');
      setPaymentStatusFilter('PAID');
      setSettlementFilter('ALL');
      return;
    }
    if (chip === 'RECONCILE') {
      setSettlementFilter('RECONCILE');
      setPaymentStatusFilter('PAID');
      return;
    }
    if (chip === 'DUE') {
      setSettlementFilter('DUE');
      setPaymentStatusFilter('PAID');
    }
  };


  const handleConfirm = async (booking: BookingResponse) => {
    // For bank transfer (QR), allow confirm once guest uploaded transfer proof.
    const isQr = String(booking.paymentMethod || '').toUpperCase() === 'QR_CODE';
    const hasProof = !!booking.transferProofImageUrl;
    if (booking.paymentStatus !== 'PAID' && !(isQr && hasProof)) {
      alert('Cannot confirm booking: Payment not completed yet');
      return;
    }

    if (!confirm(`Confirm booking from ${booking.guest.firstName} ${booking.guest.lastName}?`)) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await api.confirmBooking(booking.id);
      if (response.success) {
        alert('Booking confirmed successfully!');
        await loadBookings();
      }
    } catch (error: any) {
      setError(error.message || 'Failed to confirm booking');
      alert('Failed to confirm booking: ' + (error.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = (booking: BookingResponse) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
    setRejectReason('');
  };

  const handleViewGuestDetails = (booking: BookingResponse) => {
    setSelectedBooking(booking);
    setShowGuestDetailsModal(true);
  };

  const submitReject = async () => {
    if (!selectedBooking) return;

    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await api.cancelBooking(selectedBooking.id, rejectReason);
      if (response.success) {
        alert('Booking rejected successfully!');
        setShowRejectModal(false);
        setSelectedBooking(null);
        await loadBookings();
      }
    } catch (error: any) {
      setError(error.message || 'Failed to reject booking');
      alert('Failed to reject booking: ' + (error.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (status === 'PENDING') {
      if (paymentStatus === 'PAID') {
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Đang chờ duyệt</span>;
      }
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Chờ thanh toán</span>;
    }
    if (status === 'CONFIRMED') {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Đã xác nhận</span>;
    }
    if (status === 'CANCELLED') {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Đã hủy</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{status}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderBookingCard = (booking: BookingResponse) => {
    const settlement = getSettlementBadge(booking);
    return (
    <div
      key={booking.id}
      className="bg-white dark:bg-[#1A2633] rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-4">
        {/* Property Image */}
        <img
          src={booking.property.primaryImageUrl}
          alt={booking.property.title}
          className="w-24 h-24 rounded-lg object-cover"
        />

        {/* Booking Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {booking.property.title}
              </h3>
              <p className="text-sm text-gray-500">
                Booking #{booking.bookingCode}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${settlement.className}`}
                title={settlement.tooltip}
              >
                {settlement.text}
              </span>
              {getStatusBadge(booking.status, booking.paymentStatus)}
            </div>
          </div>

          {/* Guest Info */}
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-gray-400">person</span>
            <button
              onClick={() => handleViewGuestDetails(booking)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary hover:underline font-medium transition-colors"
            >
              {booking.guest.firstName} {booking.guest.lastName}
            </button>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 dark:text-gray-400">{booking.numGuests} khách</span>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-sm">calendar_today</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {booking.numNights} đêm
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-gray-400">payments</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                (booking.hostPayoutAmountVnd ?? booking.totalPrice) as any
              )}
            </span>
            <span className="text-sm text-gray-500">
              ({booking.paymentStatus === 'PAID' ? 'Đã thanh toán (giữ bởi nền tảng)' : 'Chưa thanh toán'})
            </span>
          </div>

          {/* Settlement hint */}
          {booking.paymentStatus === 'PAID' && (
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Số tiền hiển thị là <span className="font-semibold">tiền dự kiến nhận (sau phí)</span>. Nền tảng sẽ chi trả theo quy tắc settlement.
            </div>
          )}

          {/* Transfer proof (Host view) */}
          {booking.transferProofImageUrl && (
            <div className="mb-3">
              <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Biên lai chuyển khoản
              </div>
              <a
                href={booking.transferProofImageUrl.startsWith('http')
                  ? booking.transferProofImageUrl
                  : `http://localhost:8080${booking.transferProofImageUrl}`}
                target="_blank"
                rel="noreferrer"
                className="block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white"
              >
                <img
                  src={booking.transferProofImageUrl.startsWith('http')
                    ? booking.transferProofImageUrl
                    : `http://localhost:8080${booking.transferProofImageUrl}`}
                  alt="Transfer receipt"
                  className="w-full h-40 object-contain"
                />
              </a>
              {booking.transferReference && (
                <div className="text-xs text-gray-500 mt-2">Mã tham chiếu: {booking.transferReference}</div>
              )}
            </div>
          )}

          {/* Guest Message */}
          {booking.guestMessage && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Lời nhắn:</span> {booking.guestMessage}
              </p>
            </div>
          )}

          {/* Actions */}
          {booking.status === 'PENDING' && booking.paymentStatus === 'PAID' && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleConfirm(booking)}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>{' '}
                Đồng ý
              </button>
              <button
                onClick={() => handleReject(booking)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">cancel</span>{' '}
                Từ chối
              </button>
            </div>
          )}

          {booking.status === 'CONFIRMED' && (
            <div className="text-sm text-green-600 dark:text-green-400 mt-2">
              ✓ Booking đã được xác nhận
            </div>
          )}

          {booking.status === 'CANCELLED' && booking.hostResponse && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mt-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Lý do từ chối:</span> {booking.hostResponse}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-4">progress_activity</span>
        <p className="text-gray-600 dark:text-gray-400">Đang tải danh sách đặt chỗ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-[#1A2633] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        {/* Search bar (always visible) */}
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tên khách, mã booking, tên phòng..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>

        {/* Row: filter button + (money/date) quick filters + page size */}
        <div className="flex flex-wrap items-end gap-3">
          <button
            type="button"
            onClick={() => setShowFilterDetail(v => !v)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-base">filter_list</span>
            Bộ lọc chi tiết
          </button>

          {/* Sort by Amount */}
          <div className="flex-grow sm:flex-grow-0">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Lọc theo</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white"
            >
              <option value="CREATED_DESC">Mặc định (mới nhất)</option>
              <option value="AMOUNT_DESC">Tiền cao→thấp</option>
            </select>
          </div>

          {/* Check-in Date Range */}
          <div className="flex-grow sm:flex-grow-0">
            <label htmlFor="host-checkin-from" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Check-in từ</label>
            <input
              id="host-checkin-from"
              type="date"
              value={checkInFrom}
              onChange={(e) => setCheckInFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex-grow sm:flex-grow-0">
            <label htmlFor="host-checkin-to" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Check-in đến</label>
            <input
              id="host-checkin-to"
              type="date"
              value={checkInTo}
              onChange={(e) => setCheckInTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white"
            />
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 border border-transparent text-gray-600 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Xóa tất cả bộ lọc"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Reset
          </button>

          {/* Spacer */}
          <div className="flex-1 min-w-[10px]"></div>

          {/* Page Size */}
          <div className="flex items-center gap-2">
            <label htmlFor="host-page-size" className="text-xs font-semibold text-gray-600 dark:text-gray-300">/ trang</label>
            <select
              id="host-page-size"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Filter detail panel */}
        {showFilterDetail && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#0d1117]/40">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Booking Status</label>
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white"
              >
                <option value="ALL">Tất cả</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Payment Status</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white"
              >
                <option value="ALL">Tất cả</option>
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Settlement Status</label>
              <select
                value={settlementFilter}
                onChange={(e) => setSettlementFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white"
              >
                <option value="ALL">Tất cả</option>
                <option value="UNPAID">Chưa thanh toán</option>
                <option value="RECONCILE">Chờ đối soát</option>
                <option value="NOT_DUE">Chờ đến hạn</option>
                <option value="DUE">Đến hạn nhận</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Kết quả: <span className="font-semibold text-gray-800 dark:text-white">{filteredBookings.length}</span> booking</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={loadBookings}
              className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}
      {pagedBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <span className="material-symbols-outlined text-6xl mb-4">event_busy</span>
          <h3 className="text-lg font-semibold mb-2">Không có đặt chỗ nào</h3>
          <p className="mb-4">
            {bookings.length === 0
              ? 'Chưa có yêu cầu đặt chỗ nào cho các property của bạn.'
              : 'Không có booking nào khớp bộ lọc hiện tại.'}
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg text-sm max-w-md mx-auto mb-4">
            <p><strong>Để test booking flow:</strong></p>
            <p>1. Đăng nhập với tài khoản host: host@stayease.com / password123</p>
            <p>2. Hoặc đăng nhập với tài khoản user và tạo booking mới để host xem</p>
          </div>

          <button
            onClick={loadBookings}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
          >
            Tải lại
          </button>
        </div>
      ) : (
        <div>
          {/* Pending bookings that need host action */}
          {pagedBookings.some(booking => booking.status === 'PENDING' && booking.paymentStatus === 'PAID') && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500">notifications_active</span>
                Cần xác nhận ({filteredBookings.filter(booking => booking.status === 'PENDING' && booking.paymentStatus === 'PAID').length})
              </h3>
              <div className="space-y-4">
                {pagedBookings
                  .filter(booking => booking.status === 'PENDING' && booking.paymentStatus === 'PAID')
                  .map(booking => renderBookingCard(booking))}
              </div>
            </div>
          )}

          {/* Other bookings */}
          {pagedBookings.some(booking => !(booking.status === 'PENDING' && booking.paymentStatus === 'PAID')) && (
            <div>
              <div className="space-y-4">
                {pagedBookings
                  .filter(booking => !(booking.status === 'PENDING' && booking.paymentStatus === 'PAID'))
                  .map(booking => renderBookingCard(booking))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredBookings.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Trang <span className="font-semibold">{currentPage}</span> / {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage(1)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              «
            </button>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Trước
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Sau
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(totalPages)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2633] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Từ chối booking
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Booking từ {selectedBooking.guest.firstName} {selectedBooking.guest.lastName}
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Vui lòng cho biết lý do từ chối..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={submitReject}
                disabled={isProcessing || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
              >
                {isProcessing ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Details Modal */}
      {showGuestDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A2633] rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Thông tin khách
              </h3>
              <button
                onClick={() => {
                  setShowGuestDetailsModal(false);
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Guest Profile Section */}
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                {selectedBooking.guest.avatarUrl ? (
                  <img
                    src={selectedBooking.guest.avatarUrl}
                    alt={`${selectedBooking.guest.firstName} ${selectedBooking.guest.lastName}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                    {selectedBooking.guest.firstName.charAt(0)}{selectedBooking.guest.lastName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {selectedBooking.guest.firstName} {selectedBooking.guest.lastName}
                </h4>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span className="text-sm">{selectedBooking.guest.email}</span>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">
                Thông tin đặt chỗ
              </h5>

              {/* Property */}
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 mt-0.5">home</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Property</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.property.title}</p>
                </div>
              </div>

              {/* Booking Code */}
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 mt-0.5">confirmation_number</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mã booking</p>
                  <p className="font-mono font-medium text-gray-900 dark:text-white">{selectedBooking.bookingCode}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 mt-0.5">calendar_today</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ngày nhận/trả phòng</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedBooking.checkInDate)} - {formatDate(selectedBooking.checkOutDate)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.numNights} đêm</p>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 mt-0.5">group</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Số khách</p>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Tổng: {selectedBooking.numGuests} khách
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBooking.numAdults} người lớn
                      {selectedBooking.numChildren > 0 && `, ${selectedBooking.numChildren} trẻ em`}
                      {selectedBooking.numInfants > 0 && `, ${selectedBooking.numInfants} em bé`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 mt-0.5">payments</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Thông tin thanh toán</p>
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">
                    ${selectedBooking.totalPrice.toFixed(2)}
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
                    <p>Trạng thái: <span className={selectedBooking.paymentStatus === 'PAID' ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
                      {selectedBooking.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span></p>
                    {selectedBooking.paymentMethod && (
                      <p>Phương thức: {selectedBooking.paymentMethod}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Guest Message */}
              {selectedBooking.guestMessage && (
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-gray-400 mt-0.5">chat_bubble</span>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lời nhắn từ khách</p>
                    <p className="text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-1">
                      {selectedBooking.guestMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-gray-400 mt-0.5">flag</span>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Yêu cầu đặc biệt</p>
                    <p className="text-gray-900 dark:text-white bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mt-1">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 mt-0.5">info</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Trạng thái booking</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedBooking.status, selectedBooking.paymentStatus)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => {
                  setShowGuestDetailsModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Đóng
              </button>
              {selectedBooking.status === 'PENDING' && selectedBooking.paymentStatus === 'PAID' && (
                <>
                  <button
                    onClick={() => {
                      setShowGuestDetailsModal(false);
                      handleConfirm(selectedBooking);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Đồng ý
                  </button>
                  <button
                    onClick={() => {
                      setShowGuestDetailsModal(false);
                      handleReject(selectedBooking);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Từ chối
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;
