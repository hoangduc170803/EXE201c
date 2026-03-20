import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/services/api';
import type { CreateBookingRequest, BookingResponse } from '@/types';
import { Toaster, toast } from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state as CreateBookingRequest & {
    property: any;
    totalPrice: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    numNights: number;
  };

  const [paymentMethod, setPaymentMethod] = useState<'QR_CODE'>('QR_CODE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BookingResponse | null>(null);
  const [error, setError] = useState<string>('');

  const [propertyDetails, setPropertyDetails] = useState<any>(bookingData?.property);
  const [isLoadingProperty, setIsLoadingProperty] = useState(!bookingData?.property);

  const [isCreatingBookingForQr, setIsCreatingBookingForQr] = useState(false);

  const [paymentInfo, setPaymentInfo] = useState<{
    bankName: string;
    bankBin?: string | null;
    bankAccountNumber: string;
    bankAccountHolder: string;
    bankBranch?: string | null;
    paymentNotes?: string | null;
  } | null>(null);
  const [paymentInfoLoading, setPaymentInfoLoading] = useState(false);

  // Transfer proof upload (Guest) - allow uploading right on checkout
  const [proofUploading, setProofUploading] = useState(false);
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofPreview, setProofPreview] = useState<string>('');
  const [transferReference, setTransferReference] = useState('');
  const transferReferenceRef = useRef('');
  const [proofError, setProofError] = useState<string>('');
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const bookingIdRef = useRef<number | null>(null);
  const bookingFinalizedRef = useRef(false);

  const createdProofUrl = (createdBooking as any)?.transferProofImageUrl as string | undefined;
  const proofUrl = createdProofUrl || '';

  useEffect(() => {
    transferReferenceRef.current = transferReference;
  }, [transferReference]);

  useEffect(() => {
    if (!bookingData) {
      navigate('/');
      return;
    }

    if (!propertyDetails && bookingData.propertyId) {
      const fetchProperty = async () => {
        setIsLoadingProperty(true);
        try {
          const response = await api.getPropertyById(bookingData.propertyId);
          if (response.success && response.data) {
            setPropertyDetails(response.data);
          } else {
            throw new Error(response.message || 'Failed to fetch property details.');
          }
        } catch (err: any) {
          setError(err.message || 'Could not load property information.');
        } finally {
          setIsLoadingProperty(false);
        }
      };
      fetchProperty();
    }
  }, [bookingData, navigate, propertyDetails]);

  useEffect(() => {
    // When QR is selected: fetch admin payment info and create booking first to get bookingCode.
    if (paymentMethod !== 'QR_CODE') return;

    let cancelled = false;

    const ensurePaymentInfo = async () => {
      try {
        setPaymentInfoLoading(true);
        const info = await api.getPaymentInfo();
        if (!cancelled) setPaymentInfo(info);
      } catch (e) {
        console.error('Failed to load payment info:', e);
        if (!cancelled) setPaymentInfo(null);
      } finally {
        if (!cancelled) setPaymentInfoLoading(false);
      }
    };

    const ensureBookingCreated = async () => {
      if (createdBooking || bookingIdRef.current) return;
      if (!bookingData) return;
      // Avoid creating drafts until we have paymentInfo to render a valid VietQR.
      // This reduces accidental draft creation when payment info endpoint is down.
      if (!paymentInfo?.bankBin || !paymentInfo?.bankAccountNumber || !paymentInfo?.bankAccountHolder) return;

      setIsCreatingBookingForQr(true);
      setError('');
      try {
        const bookingRequest: CreateBookingRequest = {
          propertyId: Number(bookingData.propertyId),
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          numGuests: Number(bookingData.numGuests),
          numAdults: Number(bookingData.numAdults),
          numChildren: Number(bookingData.numChildren),
          numInfants: Number(bookingData.numInfants),
          specialRequests: bookingData.specialRequests || '',
          guestMessage: bookingData.guestMessage || '',
        };

        const createResponse = await api.createBooking(bookingRequest);
        if (!createResponse.success || !createResponse.data) {
          throw new Error(createResponse.message || 'Failed to create booking');
        }
        if (!cancelled) {
          setCreatedBooking(createResponse.data);
          bookingIdRef.current = createResponse.data.id;
        }
      } catch (err: any) {
        console.error('Failed to create booking for QR:', err);
        if (!cancelled) setError(err?.message || 'Không thể tạo booking để hiển thị QR. Vui lòng thử lại.');
      } finally {
        if (!cancelled) setIsCreatingBookingForQr(false);
      }
    };

    ensurePaymentInfo();
    ensureBookingCreated();

    const cleanupBooking = async (reason: string) => {
      const bookingId = bookingIdRef.current;
      if (bookingFinalizedRef.current) return;
      if (!bookingId) return;

      try {
        const bookingDetails = await api.getBookingById(bookingId);
        if (bookingDetails.success && bookingDetails.data.status === 'PENDING') {
          await api.cancelBooking(bookingId, reason);
        }
      } catch (e) {
        console.error('Failed to cleanup temporary booking:', e);
      }
    };

    // Handle tab close / refresh (best effort). Async calls are often dropped here.
    const handleBeforeUnload = () => {
      const bookingId = bookingIdRef.current;
      if (!bookingId || bookingFinalizedRef.current) return;
      try {
        // Try a keepalive fetch to maximize the chance it reaches the server.
        // NOTE: This relies on cookies for auth; if blocked, backend auto-cleanup will cover it.
        fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel?reason=${encodeURIComponent('User abandoned checkout (QR not completed)')}`,
          { method: 'PUT', credentials: 'include', keepalive: true }
        );
      } catch {
        // ignore
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cancel immediately when user navigates back/forward (popstate) instead of waiting for unmount.
    const handlePopState = () => {
      cleanupBooking('User abandoned checkout (QR not completed)');
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      cancelled = true;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      cleanupBooking('User abandoned checkout (QR not completed)');
    };
  }, [paymentMethod, bookingData, createdBooking, paymentInfo?.bankBin, paymentInfo?.bankAccountHolder, paymentInfo?.bankAccountNumber]);

  // If user created a QR draft booking but then switches payment method away from QR,
  // cancel that draft immediately to avoid leaving unwanted bookings.
  useEffect(() => {
    if (paymentMethod === 'QR_CODE') return;
    const bookingId = bookingIdRef.current;
    if (!bookingId) return;
    if (bookingFinalizedRef.current) return;

    api.cancelBooking(bookingId, 'User switched payment method').catch((e) => {
      console.error('Failed to cancel booking when switching payment method:', e);
    });

    bookingIdRef.current = null;
    setCreatedBooking(null);
  }, [paymentMethod]);

  const buildVietQrQuickLink = (args: {
    bankBin: string;
    accountNumber: string;
    amountVnd: number;
    addInfo: string;
    accountName: string;
    template?: 'compact2' | 'compact' | 'qr_only' | string;
  }) => {
    const { bankBin, accountNumber, amountVnd, addInfo, accountName, template = 'compact2' } = args;
    const encodedAddInfo = encodeURIComponent(addInfo);
    const encodedAccountName = encodeURIComponent(accountName);
    // vietqr quick link image API: https://img.vietqr.io/image/{BIN}-{ACCOUNT}-{TEMPLATE}.jpg?amount=&addInfo=&accountName=
    return `https://img.vietqr.io/image/${bankBin}-${accountNumber}-${template}.jpg?amount=${Math.max(0, Math.round(amountVnd))}&addInfo=${encodedAddInfo}&accountName=${encodedAccountName}`;
  };

  const handleUploadAndSubmitProof = async (file: File) => {
    if (!createdBooking) return;
    setProofError('');
    try {
      setProofUploading(true);
      const uploadRes = await api.uploadImage(file);

      // upload-image response shape may vary; support common variants.
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
      const submitRes = await api.submitTransferProof(createdBooking.id, {
        transferProofImageUrl: uploadedUrl,
        transferReference: transferReferenceRef.current || undefined,
      });

      if (!submitRes.success) {
        throw new Error(submitRes.message || 'Gửi biên lai thất bại');
      }

      setCreatedBooking(submitRes.data);
      toast.success('Đã gửi biên lai thành công!');
      if (confirmButtonRef.current) {
        confirmButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (e: any) {
      console.error('Upload/submit transfer proof failed:', e);
      setProofError(e?.message || 'Không thể upload/gửi biên lai');
    } finally {
      setProofUploading(false);
      setProofSubmitting(false);
    }
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} đã được sao chép!`);
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error('Sao chép thất bại.');
    });
  };

  const handleCreateBookingAndPay = async () => {
    if (!bookingData) return;

    setIsProcessing(true);
    setError('');

    try {
      // Validate required fields
      if (!bookingData.propertyId || !bookingData.checkInDate || !bookingData.checkOutDate) {
        throw new Error('Missing required booking information');
      }

      if (bookingData.numGuests < 1 || bookingData.numAdults < 1) {
        throw new Error('Invalid guest information');
      }

      // Validate dates
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        throw new Error('Check-in date cannot be in the past');
      }

      if (checkOut <= checkIn) {
        throw new Error('Check-out date must be after check-in date');
      }

      const booking = createdBooking
        ? createdBooking
        : (() => {
            throw new Error('Booking has not been created yet');
          })();
      // QR_CODE flow: booking is created first, user pays by bank transfer using VietQR.
        // For QR transfer: only consider finalized when user uploaded proof and confirmed.
        if (!createdProofUrl) {
          throw new Error('Vui lòng upload biên lai trước khi xác nhận.');
        }

        // Mark as finalized BEFORE navigating away, so cleanup does not cancel it.
        bookingFinalizedRef.current = true;

        // Optional: update booking payment status on backend to reflect QR payment intent.
        // This helps prevent it from staying in PENDING forever.
        try {
          await api.processPayment(booking.id, 'QR_CODE');
        } catch (e) {
          // Don't block user if backend doesn't support QR_CODE value; still keep the booking.
          console.warn('processPayment(QR_CODE) failed, continuing:', e);
        }

        navigate('/profile', {
          state: {
            message: 'Đã gửi biên lai. Vui lòng chờ chủ nhà xác nhận booking.',
            bookingId: booking.id
          }
        });
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  const { totalPrice, subtotal, cleaningFee, serviceFee, numNights } = bookingData;
  const property = propertyDetails;

  const propertyTitle = property?.title ?? property?.name ?? 'Chỗ nghỉ';
  const propertyTypeLabel =
    property?.propertyType?.name ?? property?.propertyType ?? property?.category?.name ?? '';

  const propertyImageUrl =
    property?.primaryImageUrl ??
    property?.images?.[0]?.imageUrl ??
    property?.propertyImages?.[0]?.imageUrl ??
    '';

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="font-sans bg-gray-50">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6 lg:mb-10"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Xác nhận và thanh toán
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Left Column */}
              <div className="lg:col-span-3">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h2 className="text-2xl font-semibold mb-5">Chọn phương thức thanh toán</h2>
                    <div className="space-y-4">

                      <label
                        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === 'QR_CODE' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="QR_CODE"
                          checked={paymentMethod === 'QR_CODE'}
                          onChange={() => setPaymentMethod('QR_CODE')}
                          className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="material-symbols-outlined text-3xl text-gray-600">qr_code_2</span>
                        <div>
                          <p className="font-semibold text-gray-800">Chuyển khoản qua QR</p>
                          <p className="text-sm text-gray-500">Quét mã VietQR để chuyển khoản nhanh chóng.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* QR Code Payment Flow */}
                  {paymentMethod === 'QR_CODE' && (
                    <div className="space-y-6">
                      {/* Step 1: Scan QR */}
                      <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">Quét mã QR để chuyển khoản</h3>
                            <p className="text-gray-600 mb-4">Sử dụng app ngân hàng của bạn để quét mã. Số tiền và nội dung chuyển khoản đã được điền sẵn.</p>
                            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg p-3 mb-4 flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">warning</span>
                              <span>Vui lòng chuyển đúng số tiền và nội dung để giao dịch được xác nhận tự động.</span>
                            </div>
                          </div>
                        </div>

                        {paymentInfoLoading || isCreatingBookingForQr ? (
                          <div className="h-60 flex items-center justify-center bg-gray-100 rounded-lg">
                            <span className="material-symbols-outlined animate-spin text-4xl text-gray-500">progress_activity</span>
                          </div>
                        ) : paymentInfo?.bankBin && paymentInfo.bankAccountNumber && paymentInfo.bankAccountHolder && createdBooking?.bookingCode ? (
                          <div className="flex flex-col md:flex-row gap-6 mt-4">
                            <div className="flex-shrink-0">
                              <img
                                src={buildVietQrQuickLink({
                                  bankBin: paymentInfo.bankBin,
                                  accountNumber: paymentInfo.bankAccountNumber,
                                  amountVnd: bookingData.totalPrice,
                                  addInfo: `STAYEASE BOOKING ${createdBooking.bookingCode}`,
                                  accountName: paymentInfo.bankAccountHolder,
                                  template: 'compact',
                                })}
                                alt="VietQR Code"
                                className="w-48 h-48 rounded-lg border"
                              />
                            </div>
                            <div className="flex-grow space-y-3 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500">Ngân hàng</span>
                                <span className="font-semibold text-gray-800">{paymentInfo.bankName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500">Chủ tài khoản</span>
                                <span className="font-semibold text-gray-800">{paymentInfo.bankAccountHolder}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500">Số tài khoản</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-800">{paymentInfo.bankAccountNumber}</span>
                                  <button onClick={() => handleCopyToClipboard(paymentInfo.bankAccountNumber, 'Số tài khoản')} className="text-emerald-600 hover:text-emerald-800">
                                    <span className="material-symbols-outlined text-base">content_copy</span>
                                  </button>
                                </div>
                              </div>
                              <div className="bg-gray-100 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-gray-500">Nội dung</p>
                                    <p className="font-semibold text-gray-800">STAYEASE BOOKING {createdBooking.bookingCode}</p>
                                  </div>
                                  <button onClick={() => handleCopyToClipboard(`STAYEASE BOOKING ${createdBooking.bookingCode}`, 'Nội dung')} className="text-emerald-600 hover:text-emerald-800">
                                    <span className="material-symbols-outlined text-base">content_copy</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-10 text-gray-600">
                            <p>Không thể tải thông tin thanh toán. Vui lòng thử lại.</p>
                          </div>
                        )}
                      </div>

                      {/* Step 2: Upload Receipt */}
                      <div className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${createdProofUrl ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-700'}`}>2</div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">Tải lên biên lai chuyển khoản</h3>
                            <p className="text-gray-600 mb-4">Sau khi chuyển khoản thành công, vui lòng chụp ảnh màn hình và tải lên đây để chủ nhà xác nhận.</p>
                          </div>
                        </div>

                        {!createdBooking?.id ? (
                          <div className="text-sm text-gray-500 ml-12">Vui lòng hoàn thành Bước 1 để tiếp tục.</div>
                        ) : (
                          <div className="ml-12 mt-4">
                            {proofError && <div className="text-red-600 text-sm mb-3">{proofError}</div>}

                              <div className="mb-4">
                                <label htmlFor="transferReference" className="block text-sm font-medium text-gray-700 mb-1">
                                  Mã tham chiếu (tuỳ chọn)
                                </label>
                                <input
                                  id="transferReference"
                                  value={transferReference}
                                  onChange={(e) => setTransferReference(e.target.value)}
                                  placeholder="VD: FT123456789"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                />
                              </div>
                            
                            <div className="flex items-center gap-4">
                                <input
                                  id="transferProof"
                                  type="file"
                                  accept="image/*"
                                  disabled={proofUploading || proofSubmitting || !!createdProofUrl}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleUploadAndSubmitProof(f);
                                  }}
                                  className="hidden"
                                />
                                <label htmlFor="transferProof" className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all ${proofUploading || proofSubmitting || !!createdProofUrl ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}>
                                  <span className="material-symbols-outlined">upload_file</span>
                                  {proofUploading ? 'Đang tải lên...' : (createdProofUrl ? 'Đã tải lên' : 'Chọn ảnh biên lai')}
                                </label>
                                {(proofUploading || proofSubmitting) && <span className="material-symbols-outlined animate-spin text-gray-500">progress_activity</span>}
                            </div>

                            {(proofUrl || proofPreview) && (
                              <div className="mt-4">
                                <p className="font-medium text-sm mb-2">Xem trước biên lai:</p>
                                <img
                                  src={(proofUrl || proofPreview).startsWith('http') ? (proofUrl || proofPreview) : `http://localhost:8080${proofUrl || proofPreview}`}
                                  alt="Transfer proof preview"
                                  className="max-w-xs h-auto rounded-lg border border-gray-300"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <hr className="my-8" />

                {/* Confirmation Button */}
                <div className="mt-6">
                  <button
                    ref={confirmButtonRef}
                    onClick={handleCreateBookingAndPay}
                    disabled={isProcessing || (paymentMethod === 'QR_CODE' && !createdProofUrl)}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        <span>Đang xử lý...</span>
                      </>
                    ) : ('Tôi đã chuyển khoản & gửi biên lai'
                    )}
                  </button>
                  {paymentMethod === 'QR_CODE' && !createdProofUrl && (
                    <p className="text-center text-sm text-gray-500 mt-3">Vui lòng tải lên biên lai để kích hoạt nút này.</p>
                  )}
                </div>
              </div>

              {/* Right Column - Booking Summary */}
              <div className="lg:col-span-2">
                <div className="border border-gray-200 rounded-xl p-6 sticky top-28">
                  {isLoadingProperty ? (
                    <div className="flex items-center justify-center h-48">
                      <span className="material-symbols-outlined animate-spin text-3xl text-gray-500">progress_activity</span>
                    </div>
                  ) : property ? (
                    <>
                      <div className="flex gap-4">
                        <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                          {propertyImageUrl ? (
                            <img
                              src={propertyImageUrl}
                              alt={propertyTitle}
                              className="w-32 h-24 object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-gray-400">image</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          {propertyTypeLabel && <p className="text-sm text-gray-500 truncate">{propertyTypeLabel}</p>}
                          <p className="font-semibold text-gray-800 truncate">{propertyTitle}</p>
                        </div>
                      </div>

                      <hr className="my-6" />

                      <h3 className="text-xl font-semibold mb-4">Chi tiết giá</h3>
                      <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between">
                          <span>
                            {new Intl.NumberFormat('vi-VN').format(property?.pricePerNight ?? bookingData?.property?.pricePerNight ?? 0)}đ x {numNights} đêm
                          </span>
                          <span>{new Intl.NumberFormat('vi-VN').format(subtotal)}đ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phí vệ sinh</span>
                          <span>{new Intl.NumberFormat('vi-VN').format(cleaningFee)}đ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phí dịch vụ</span>
                          <span>{new Intl.NumberFormat('vi-VN').format(serviceFee)}đ</span>
                        </div>
                      </div>

                      <hr className="my-6" />

                      <div className="flex justify-between font-bold text-lg">
                        <span>Tổng cộng (VND)</span>
                        <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10 text-gray-600">
                      <p>Không thể tải thông tin chỗ nghỉ.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
