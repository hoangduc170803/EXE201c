import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/services/api';
import type { CreateBookingRequest, BookingResponse } from '@/types';

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

  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'QR_CODE'>('CREDIT_CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BookingResponse | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!bookingData) {
      navigate('/');
    }
  }, [bookingData, navigate]);

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

      // Step 1: Create booking
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

      console.log('Sending booking request:', bookingRequest);
      const createResponse = await api.createBooking(bookingRequest);
      console.log('Create response:', createResponse);

      if (!createResponse.success || !createResponse.data) {
        throw new Error('Failed to create booking');
      }

      const booking = createResponse.data;
      setCreatedBooking(booking);

      // Step 2: Process payment (simulate)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate payment processing

      const paymentResponse = await api.processPayment(
        booking.id,
        paymentMethod === 'CREDIT_CARD' ? 'Credit Card' : 'QR Code'
      );

      if (!paymentResponse.success) {
        throw new Error('Payment processing failed');
      }

      // Step 3: Navigate to success page or bookings
      setTimeout(() => {
        navigate('/profile', {
          state: {
            message: 'Booking created and payment processed successfully!',
            bookingId: booking.id
          }
        });
      }, 1000);

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to complete booking. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to listing
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Payment Form */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Confirm and pay
            </h1>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Booking Summary */}
            <div className="bg-white dark:bg-[#1A2633] rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Your trip
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Dates</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {bookingData.checkInDate} - {bookingData.checkOutDate}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Guests</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {bookingData.numGuests} guest{bookingData.numGuests > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-[#1A2633] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Choose payment method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  style={{ borderColor: paymentMethod === 'CREDIT_CARD' ? '#3b82f6' : '#d1d5db' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CREDIT_CARD"
                    checked={paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setPaymentMethod('CREDIT_CARD')}
                    className="w-5 h-5"
                  />
                  <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-gray-300">
                    credit_card
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Credit Card</div>
                    <div className="text-sm text-gray-500">Pay with Visa, Mastercard, etc.</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  style={{ borderColor: paymentMethod === 'QR_CODE' ? '#3b82f6' : '#d1d5db' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="QR_CODE"
                    checked={paymentMethod === 'QR_CODE'}
                    onChange={() => setPaymentMethod('QR_CODE')}
                    className="w-5 h-5"
                  />
                  <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-gray-300">
                    qr_code
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">QR Code</div>
                    <div className="text-sm text-gray-500">Scan to pay with mobile banking</div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'QR_CODE' && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg mb-2">
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-gray-400">qr_code_scanner</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    QR Code for payment (Demo)
                  </p>
                </div>
              )}

              <button
                onClick={handleCreateBookingAndPay}
                disabled={isProcessing}
                className="w-full mt-6 bg-primary hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg shadow-md"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Processing...
                  </span>
                ) : (
                  `Pay $${bookingData.totalPrice.toFixed(2)}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                {createdBooking
                  ? `Processing payment for booking ${createdBooking.bookingCode}...`
                  : 'This is a demo. Payment will be simulated.'}
              </p>
            </div>
          </div>

          {/* Right: Price Breakdown */}
          <div>
            <div className="sticky top-24 bg-white dark:bg-[#1A2633] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <img
                  src={bookingData.property.primaryImageUrl}
                  alt={bookingData.property.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {bookingData.property.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {bookingData.property.city}, {bookingData.property.country}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Price details
              </h3>

              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span className="underline">
                    ${bookingData.property.pricePerNight} × {bookingData.numNights} nights
                  </span>
                  <span>${bookingData.subtotal.toFixed(2)}</span>
                </div>
                {bookingData.cleaningFee > 0 && (
                  <div className="flex justify-between">
                    <span className="underline">Cleaning fee</span>
                    <span>${bookingData.cleaningFee.toFixed(2)}</span>
                  </div>
                )}
                {bookingData.serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span className="underline">Service fee</span>
                    <span>${bookingData.serviceFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 font-bold text-lg text-gray-900 dark:text-white">
                <span>Total (USD)</span>
                <span>${bookingData.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
