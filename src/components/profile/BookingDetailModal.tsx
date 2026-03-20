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

  // Transfer proof (QR)
  const [proofUploading, setProofUploading] = useState(false);
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofPreview, setProofPreview] = useState<string>('');
  const [transferReference, setTransferReference] = useState('');

  // Refund state
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundRequest, setRefundRequest] = useState<Awaited<ReturnType<typeof api.getRefundRequestForBooking>> extends infer R
    ? R extends { data: infer D } ? D : any
    : any>(null);
  const [refundAccounts, setRefundAccounts] = useState<any[]>([]);
  const [refundAccountId, setRefundAccountId] = useState<number | ''>('');
  const [refundReason, setRefundReason] = useState('');
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [newRefundAccount, setNewRefundAccount] = useState({ bankName: '', accountNumber: '', accountHolder: '', isDefault: true });

  useEffect(() => {
    if (isOpen && bookingId) {
      loadBookingDetail();
    }
  }, [isOpen, bookingId]);

  useEffect(() => {
    if (!isOpen || !booking) return;

    // Load refund info when booking is cancelled (refund may be 0 depending on policy/time)
    if (String(booking.status).toUpperCase() === 'CANCELLED') {
      loadRefundInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, booking?.id, booking?.status, booking?.refundAmount]);

  const loadBookingDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getBookingById(bookingId);
      if (response.success) {
        setBooking(response.data);
        setTransferReference(response.data.transferReference || '');
        if (response.data.transferProofImageUrl) {
          const u = response.data.transferProofImageUrl;
          setProofPreview(u.startsWith('http') ? u : `http://localhost:8080${u}`);
        } else {
          setProofPreview('');
        }
      }
    } catch (error) {
      console.error('Error loading booking detail:', error);
      setError('Không thể tải thông tin đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAndSubmitProof = async (file: File) => {
    if (!booking) return;
    setError(null);

    try {
      setProofUploading(true);
      const uploadRes = await api.uploadImage(file);

      // upload-image response shape may vary across backends; support common variants.
      let uploadedUrl: string | undefined;
      if (uploadRes?.success && uploadRes?.data?.url) {
        uploadedUrl = uploadRes.data.url;
      } else if (uploadRes?.success && Array.isArray(uploadRes?.data) && uploadRes.data[0]?.url) {
        uploadedUrl = uploadRes.data[0].url;
      } else if (uploadRes?.data?.data?.url) {
        uploadedUrl = uploadRes.data.data.url;
      }

      if (!uploadedUrl) {
        throw new Error('Upload biên lai thất bại (không nhận được URL)');
      }

      setProofPreview(uploadedUrl.startsWith('http') ? uploadedUrl : `http://localhost:8080${uploadedUrl}`);
      setProofUploading(false);

      setProofSubmitting(true);
      const submitRes = await api.submitTransferProof(booking.id, {
        transferProofImageUrl: uploadedUrl,
        transferReference: transferReference || undefined,
      });

      if (!submitRes.success) {
        throw new Error(submitRes.message || 'Gửi biên lai thất bại');
      }

      setBooking(submitRes.data);
      if (onBookingUpdated) onBookingUpdated();
    } catch (e: any) {
      console.error('Upload/submit transfer proof failed:', e);
      setError(e?.message || 'Không thể upload/gửi biên lai');
    } finally {
      setProofUploading(false);
      setProofSubmitting(false);
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

  const loadRefundInfo = async () => {
    if (!booking) return;
    setRefundLoading(true);
    setError(null);
    try {
      const [rrRes, accountsRes] = await Promise.all([
        api.getRefundRequestForBooking(booking.id),
        api.getRefundAccounts()
      ]);

      if (rrRes.success) {
        setRefundRequest(rrRes.data);
      }

      if (accountsRes.success) {
        setRefundAccounts(accountsRes.data);
        const defaultAcc = accountsRes.data.find((a: any) => a.isDefault);
        if (defaultAcc) setRefundAccountId(defaultAcc.id);
        else if (accountsRes.data.length > 0) setRefundAccountId(accountsRes.data[0].id);
      }
    } catch (e) {
      console.error('Error loading refund info:', e);
      setError('Không thể tải thông tin hoàn tiền');
    } finally {
      setRefundLoading(false);
    }
  };

  const handleCreateRefundAccount = async () => {
    setRefundLoading(true);
    setError(null);
    try {
      const res = await api.createRefundAccount(newRefundAccount);
      if (res.success) {
        const accountsRes = await api.getRefundAccounts();
        if (accountsRes.success) {
          setRefundAccounts(accountsRes.data);
          setRefundAccountId(res.data.id);
          setShowRefundForm(false);
        }
      }
    } catch (e) {
      console.error('Error creating refund account:', e);
      setError('Không thể tạo tài khoản nhận hoàn');
    } finally {
      setRefundLoading(false);
    }
  };

  const handleCreateRefundRequest = async () => {
    if (!booking) return;
    if (!refundAccountId) {
      setError('Vui lòng chọn hoặc tạo tài khoản nhận hoàn');
      return;
    }

    setRefundLoading(true);
    setError(null);
    try {
      const res = await api.createRefundRequest(booking.id, {
        refundAccountId: Number(refundAccountId),
        reason: refundReason || undefined
      });
      if (res.success) {
        setRefundRequest(res.data);
        setRefundReason('');
        if (onBookingUpdated) onBookingUpdated();
      }
    } catch (e) {
      console.error('Error creating refund request:', e);
      setError('Không thể gửi yêu cầu hoàn tiền');
    } finally {
      setRefundLoading(false);
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
    const st = status?.toUpperCase();
    return (st === 'CONFIRMED' || st === 'PENDING') && checkIn > now;
  };

  const renderRefundStatus = (status?: string) => {
    switch (String(status || '').toUpperCase()) {
      case 'REQUESTED':
        return { text: 'Đã gửi yêu cầu', cls: 'bg-yellow-100 text-yellow-800' };
      case 'APPROVED':
        return { text: 'Đã duyệt', cls: 'bg-emerald-100 text-emerald-800' };
      case 'REJECTED':
        return { text: 'Bị từ chối', cls: 'bg-red-100 text-red-800' };
      case 'PAID':
        return { text: 'Đã hoàn tiền', cls: 'bg-green-100 text-green-800' };
      default:
        return { text: 'Chưa yêu cầu', cls: 'bg-gray-100 text-gray-800' };
    }
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

                {/* Transfer proof upload (Guest) */}
                {String(booking.paymentMethod || '').toUpperCase() === 'QR_CODE' && (
                  <div className="mt-4 rounded-lg border border-gray-200 p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-gray-900">Biên lai chuyển khoản</div>
                        <div className="text-sm text-gray-600">
                          Upload ảnh biên lai để chủ nhà kiểm tra và xác nhận đặt phòng.
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.transferProofImageUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {booking.transferProofImageUrl ? 'Đã gửi' : 'Chưa gửi'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mã tham chiếu (tuỳ chọn)</label>
                        <input
                          value={transferReference}
                          onChange={(e) => setTransferReference(e.target.value)}
                          placeholder="VD: FT123456789"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        />

                        <div className="mt-3">
                          <input
                            type="file"
                            accept="image/*"
                            disabled={proofUploading || proofSubmitting}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadAndSubmitProof(f);
                            }}
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            Chấp nhận PNG/JPG. Nên chụp rõ số tiền và nội dung chuyển khoản.
                          </div>
                          {(proofUploading || proofSubmitting) && (
                            <div className="text-sm text-gray-600 mt-2">Đang xử lý biên lai...</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Xem trước</div>
                        {booking.transferProofImageUrl || proofPreview ? (
                          <a
                            href={(booking.transferProofImageUrl || proofPreview).startsWith('http')
                              ? (booking.transferProofImageUrl || proofPreview)
                              : `http://localhost:8080${booking.transferProofImageUrl || proofPreview}`}
                            target="_blank"
                            rel="noreferrer"
                            className="block border border-gray-200 rounded-lg overflow-hidden bg-white"
                          >
                            <img
                              src={(booking.transferProofImageUrl || proofPreview).startsWith('http')
                                ? (booking.transferProofImageUrl || proofPreview)
                                : `http://localhost:8080${booking.transferProofImageUrl || proofPreview}`}
                              alt="Transfer proof"
                              className="w-full h-48 object-contain"
                            />
                          </a>
                        ) : (
                          <div className="h-48 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-500">
                            Chưa có biên lai
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Refund Section (cancelled bookings) */}
              {String(booking.status).toUpperCase() === 'CANCELLED' && (
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Hoàn tiền</h5>
                      <p className="text-sm text-gray-600">
                        Số tiền được hoàn theo chính sách:{' '}
                        <span className="font-medium text-gray-900">
                          {formatCurrency(booking.refundAmount ?? 0)}
                        </span>
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${renderRefundStatus(refundRequest?.status).cls}`}>
                      {renderRefundStatus(refundRequest?.status).text}
                    </span>
                  </div>

                  {(booking.refundAmount ?? 0) <= 0 && (
                    <div className="mt-3 text-sm text-gray-600">
                      Booking này không phát sinh hoàn tiền (có thể do chính sách hủy hoặc thời điểm hủy).
                    </div>
                  )}

                  {refundLoading ? (
                    <div className="mt-4 text-sm text-gray-600">Đang tải thông tin hoàn tiền...</div>
                  ) : refundRequest ? (
                    <div className="mt-4 text-sm text-gray-700 space-y-2">
                      <div>
                        <span className="text-gray-600">Tài khoản nhận hoàn:</span>{' '}
                        <span className="font-medium">
                          {refundRequest.refundAccount?.bankName} • {refundRequest.refundAccount?.accountNumber} • {refundRequest.refundAccount?.accountHolder}
                        </span>
                      </div>
                      {refundRequest.adminNote && (
                        <div>
                          <span className="text-gray-600">Ghi chú:</span> {refundRequest.adminNote}
                        </div>
                      )}
                      {refundRequest.payoutReference && (
                        <div>
                          <span className="text-gray-600">Mã tham chiếu:</span> {refundRequest.payoutReference}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {((booking.refundAmount ?? 0) <= 0) && (
                        <div className="flex justify-end">
                          <button
                            onClick={onClose}
                            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                          >
                            Đóng
                          </button>
                        </div>
                      )}

                      {(booking.refundAmount ?? 0) > 0 && (
                        <>
                          {refundAccounts.length === 0 ? (
                        <div className="rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Nhập tài khoản nhận hoàn</p>
                            <button
                              className="text-sm text-primary hover:underline"
                              onClick={() => setShowRefundForm((v) => !v)}
                            >
                              {showRefundForm ? 'Ẩn' : 'Mở form'}
                            </button>
                          </div>

                          {showRefundForm && (
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                value={newRefundAccount.bankName}
                                onChange={(e) => setNewRefundAccount((p) => ({ ...p, bankName: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Ngân hàng (VD: Vietcombank)"
                              />
                              <input
                                value={newRefundAccount.accountNumber}
                                onChange={(e) => setNewRefundAccount((p) => ({ ...p, accountNumber: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Số tài khoản"
                              />
                              <input
                                value={newRefundAccount.accountHolder}
                                onChange={(e) => setNewRefundAccount((p) => ({ ...p, accountHolder: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                                placeholder="Chủ tài khoản"
                              />
                              <div className="md:col-span-2 flex gap-2">
                                <button
                                  onClick={handleCreateRefundAccount}
                                  disabled={refundLoading || !newRefundAccount.bankName || !newRefundAccount.accountNumber || !newRefundAccount.accountHolder}
                                  className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
                                >
                                  Lưu tài khoản
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản nhận hoàn</label>
                            <select
                              value={refundAccountId}
                              onChange={(e) => setRefundAccountId(e.target.value ? Number(e.target.value) : '')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="">-- Chọn tài khoản --</option>
                              {refundAccounts.map((a: any) => (
                                <option key={a.id} value={a.id}>
                                  {a.bankName} • {a.accountNumber} • {a.accountHolder}{a.isDefault ? ' (mặc định)' : ''}
                                </option>
                              ))}
                            </select>
                            <button
                              className="mt-2 text-sm text-primary hover:underline"
                              onClick={() => setShowRefundForm((v) => !v)}
                            >
                              {showRefundForm ? 'Ẩn form thêm mới' : 'Thêm tài khoản mới'}
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lý do (không bắt buộc)</label>
                            <textarea
                              value={refundReason}
                              onChange={(e) => setRefundReason(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              rows={3}
                              placeholder="Nhập lý do yêu cầu hoàn tiền..."
                            />
                          </div>
                        </div>
                          )}

                      {showRefundForm && refundAccounts.length > 0 && (
                        <div className="rounded-lg border border-gray-200 p-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">Thêm tài khoản nhận hoàn</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              value={newRefundAccount.bankName}
                              onChange={(e) => setNewRefundAccount((p) => ({ ...p, bankName: e.target.value }))}
                              className="px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Ngân hàng (VD: Vietcombank)"
                            />
                            <input
                              value={newRefundAccount.accountNumber}
                              onChange={(e) => setNewRefundAccount((p) => ({ ...p, accountNumber: e.target.value }))}
                              className="px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Số tài khoản"
                            />
                            <input
                              value={newRefundAccount.accountHolder}
                              onChange={(e) => setNewRefundAccount((p) => ({ ...p, accountHolder: e.target.value }))}
                              className="px-3 py-2 border border-gray-300 rounded-md md:col-span-2"
                              placeholder="Chủ tài khoản"
                            />
                            <div className="md:col-span-2">
                              <button
                                onClick={handleCreateRefundAccount}
                                disabled={refundLoading || !newRefundAccount.bankName || !newRefundAccount.accountNumber || !newRefundAccount.accountHolder}
                                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
                              >
                                Lưu tài khoản
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          onClick={handleCreateRefundRequest}
                          disabled={refundLoading || refundAccounts.length === 0 || !refundAccountId}
                          className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Gửi yêu cầu hoàn tiền
                        </button>
                      </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

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
