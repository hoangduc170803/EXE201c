import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import type { PropertyDto } from '@/services/api';

interface BookingWidgetProps {
  pricePerNight: number;
  rating: number;
  totalReviews: number;
  cleaningFee?: number;
  serviceFee?: number;
  property: PropertyDto;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({
  pricePerNight,
  rating,
  totalReviews,
  cleaningFee = 0,
  serviceFee = 0,
  property
}) => {
  const navigate = useNavigate();
  const guestPickerRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [checkInDateObj, setCheckInDateObj] = useState<Date | null>(null);
  const [checkOutDateObj, setCheckOutDateObj] = useState<Date | null>(null);
  const [numGuests, setNumGuests] = useState(1);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [numInfants, setNumInfants] = useState(0);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  const nights = checkInDate && checkOutDate
    ? Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const subtotal = pricePerNight * nights;
  const total = subtotal + cleaningFee + serviceFee;

  useEffect(() => {
    setNumGuests(numAdults + numChildren);
  }, [numAdults, numChildren]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await api.getBookedDates(property.id);
        if (response.success && response.data) {
          setBookedDates(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch booked dates:', error);
      }
    };

    fetchBookedDates();
  }, [property.id]);

  // Sync date objects with string dates
  useEffect(() => {
    if (checkInDateObj) {
      setCheckInDate(checkInDateObj.toISOString().split('T')[0]);
    }
  }, [checkInDateObj]);

  useEffect(() => {
    if (checkOutDateObj) {
      setCheckOutDate(checkOutDateObj.toISOString().split('T')[0]);
    }
  }, [checkOutDateObj]);

  useEffect(() => {
    if (!showGuestPicker) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false);
      }
    };

    // Add listener after a small delay to avoid immediate trigger
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGuestPicker]);

  useEffect(() => {
    if (!showDatePicker) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    // Add listener after a small delay to avoid immediate trigger
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const handleCheckAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      setAvailabilityMessage('Please select check-in and check-out dates');
      return;
    }

    if (numGuests > property.maxGuests) {
      setAvailabilityMessage(`Maximum ${property.maxGuests} guests allowed`);
      return;
    }

    setIsCheckingAvailability(true);
    setAvailabilityMessage('');

    try {
      const response = await api.checkAvailability(property.id, checkInDate, checkOutDate);

      if (response.success && response.data.available) {
        // Navigate to checkout page with booking data
        navigate('/checkout', {
          state: {
            propertyId: property.id,
            checkInDate,
            checkOutDate,
            numGuests,
            numAdults,
            numChildren,
            numInfants,
            property: {
              id: property.id,
              title: property.title,
              city: property.city,
              country: property.country,
              primaryImageUrl: property.primaryImageUrl,
              pricePerNight: property.pricePerNight,
            },
            numNights: nights,
            subtotal,
            cleaningFee,
            serviceFee,
            totalPrice: total,
          }
        });
      } else {
        setAvailabilityMessage('Property is not available for selected dates');
      }
    } catch (error: any) {
      setAvailabilityMessage(error.message || 'Failed to check availability');
    } finally {
      setIsCheckingAvailability(false);
    }
  };


  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    return date < today || bookedDates.includes(dateStr);
  };

  const isDateSelected = (date: Date) => {
    if (checkInDateObj && date.toDateString() === checkInDateObj.toDateString()) return 'checkin';
    if (checkOutDateObj && date.toDateString() === checkOutDateObj.toDateString()) return 'checkout';
    return null;
  };

  const isDateInRange = (date: Date) => {
    if (!checkInDateObj || !checkOutDateObj) return false;
    return date > checkInDateObj && date < checkOutDateObj;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!selectingCheckOut || !checkInDateObj) {
      setCheckInDateObj(date);
      setCheckOutDateObj(null);
      setSelectingCheckOut(true);
    } else if (date <= checkInDateObj) {
      setCheckInDateObj(date);
      setCheckOutDateObj(null);
    } else {
      setCheckOutDateObj(date);
      setSelectingCheckOut(false);
      setShowDatePicker(false);
    }
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return 'Add date';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const clearDates = () => {
    setCheckInDateObj(null);
    setCheckOutDateObj(null);
    setCheckInDate('');
    setCheckOutDate('');
    setSelectingCheckOut(false);
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const today = new Date();
    if (prev >= new Date(today.getFullYear(), today.getMonth())) {
      setCurrentMonth(prev);
    }
  };

  const renderMonth = (monthDate: Date) => {
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDay = getFirstDayOfMonth(monthDate);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const inRange = isDateInRange(date);

      let buttonClass = 'h-9 w-9 rounded-lg text-sm font-medium transition-all hover:scale-105 ';
      if (disabled) {
        buttonClass += 'text-gray-300 dark:text-gray-600 cursor-not-allowed line-through bg-gray-50 dark:bg-gray-800 opacity-60';
      } else if (selected === 'checkin' || selected === 'checkout') {
        buttonClass += 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md';
      } else if (inRange) {
        buttonClass += 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700';
      } else {
        buttonClass += 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600';
      }

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={disabled}
          className={buttonClass}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const getButtonText = () => {
    if (isCheckingAvailability) return 'Checking...';
    if (nights > 0) return 'Reserve';
    return 'Check availability';
  };

  return (
    <div className="relative lg:col-span-1">
      <div className="sticky top-28 z-10 w-full">
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-6 bg-white dark:bg-[#1A2633]">
          <div className="flex justify-between items-end mb-5">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#0d141b] dark:text-white">${pricePerNight}</span>
              <span className="text-gray-500 text-sm">night</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold">
              <span className="material-symbols-outlined text-[16px] filled">star</span>
              <span>{rating > 0 ? rating.toFixed(2) : 'New'}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 underline decoration-gray-400 cursor-pointer">
                {totalReviews} reviews
              </span>
            </div>
          </div>

          {/* Date Picker */}
          <div className="mb-4 relative" ref={datePickerRef}>
            <div className="border border-gray-400 rounded-t-lg overflow-hidden">
              <div
                role="button"
                tabIndex={0}
                className="flex border-b border-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowDatePicker(!showDatePicker)}
                onKeyDown={(e) => e.key === 'Enter' && setShowDatePicker(!showDatePicker)}
              >
                <div className="flex-1 p-3 border-r border-gray-400">
                  <div className="text-[10px] uppercase font-bold text-[#0d141b] dark:text-white">
                    Check-in
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDateDisplay(checkInDateObj)}
                  </div>
                </div>
                <div className="flex-1 p-3">
                  <div className="text-[10px] uppercase font-bold text-[#0d141b] dark:text-white">
                    Check-out
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDateDisplay(checkOutDateObj)}
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Popup */}
            {showDatePicker && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-[9999] w-[600px] sm:w-[650px] lg:w-[700px]">
                {/* Selected dates summary */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className={`flex-1 p-2.5 rounded-lg border ${selectingCheckOut ? 'border-gray-200 dark:border-gray-600' : 'border-primary bg-blue-50 dark:bg-blue-900/20'}`}>
                    <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Check-in</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDateDisplay(checkInDateObj)}</div>
                  </div>
                  <div className={`flex-1 p-2.5 rounded-lg border ${selectingCheckOut && checkInDateObj ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}`}>
                    <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Check-out</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDateDisplay(checkOutDateObj)}</div>
                  </div>
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Month */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={prevMonth}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                      </button>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h3>
                      <div className="w-7" />
                    </div>

                    {/* Days of week header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {daysOfWeek.map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1.5">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                      {renderMonth(currentMonth)}
                    </div>
                  </div>

                  {/* Next Month */}
                  <div className="flex-1 min-w-0 hidden lg:block">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-7" />
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {months[new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).getMonth()]} {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).getFullYear()}
                      </h3>
                      <button
                        onClick={nextMonth}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                      </button>
                    </div>

                    {/* Days of week header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {daysOfWeek.map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1.5">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                      {renderMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <button
                    onClick={clearDates}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 underline hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Clear dates
                  </button>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <div className="relative guest-picker-container border border-t-0 border-gray-400 rounded-b-lg" ref={guestPickerRef}>
              <div
                role="button"
                tabIndex={0}
                className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowGuestPicker(!showGuestPicker)}
                onKeyDown={(e) => e.key === 'Enter' && setShowGuestPicker(!showGuestPicker)}
              >
                <div className="text-[10px] uppercase font-bold text-[#0d141b] dark:text-white">
                  Guests
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {numGuests} guest{numGuests > 1 ? 's' : ''}
                </div>
                <span className="material-symbols-outlined absolute right-3 top-4 text-xl">
                  expand_more
                </span>
              </div>

              {showGuestPicker && (
                <div
                  className="absolute top-full left-0 right-0 bg-white dark:bg-[#1A2633] border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 p-4 mt-1"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Adults</div>
                        <div className="text-sm text-gray-500">Age 13+</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setNumAdults(Math.max(1, numAdults - 1))}
                          disabled={numAdults <= 1}
                          className="w-8 h-8 rounded-full border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-900 dark:hover:border-white"
                        >
                          <span className="material-symbols-outlined text-lg">remove</span>
                        </button>
                        <span className="w-8 text-center">{numAdults}</span>
                        <button
                          onClick={() => setNumAdults(Math.min(property.maxGuests, numAdults + 1))}
                          disabled={numGuests >= property.maxGuests}
                          className="w-8 h-8 rounded-full border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-900 dark:hover:border-white"
                        >
                          <span className="material-symbols-outlined text-lg">add</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Children</div>
                        <div className="text-sm text-gray-500">Ages 2-12</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setNumChildren(Math.max(0, numChildren - 1))}
                          disabled={numChildren <= 0}
                          className="w-8 h-8 rounded-full border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-900 dark:hover:border-white"
                        >
                          <span className="material-symbols-outlined text-lg">remove</span>
                        </button>
                        <span className="w-8 text-center">{numChildren}</span>
                        <button
                          onClick={() => setNumChildren(numChildren + 1)}
                          disabled={numGuests >= property.maxGuests}
                          className="w-8 h-8 rounded-full border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-900 dark:hover:border-white"
                        >
                          <span className="material-symbols-outlined text-lg">add</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Infants</div>
                        <div className="text-sm text-gray-500">Under 2</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setNumInfants(Math.max(0, numInfants - 1))}
                          disabled={numInfants <= 0}
                          className="w-8 h-8 rounded-full border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-900 dark:hover:border-white"
                        >
                          <span className="material-symbols-outlined text-lg">remove</span>
                        </button>
                        <span className="w-8 text-center">{numInfants}</span>
                        <button
                          onClick={() => setNumInfants(numInfants + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 hover:border-gray-900 dark:hover:border-white"
                        >
                          <span className="material-symbols-outlined text-lg">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGuestPicker(false)}
                    className="mt-4 w-full text-center text-sm font-semibold text-gray-900 dark:text-white hover:underline"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          {availabilityMessage && (
            <div className={`text-sm mb-3 p-2 rounded ${
              availabilityMessage.includes('not available') 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            }`}>
              {availabilityMessage}
            </div>
          )}


          <button
            onClick={handleCheckAvailability}
            disabled={isCheckingAvailability || !checkInDate || !checkOutDate}
            className="w-full bg-primary hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-lg transition-colors text-lg mb-4 shadow-md shadow-blue-200 dark:shadow-none"
          >
            {getButtonText()}
          </button>

          <div className="text-center text-sm text-gray-500 mb-4">You won't be charged yet</div>

          {/* Pricing Calculation */}
          {nights > 0 && (
            <>
              <div className="flex flex-col gap-3 text-gray-600 dark:text-gray-300 text-base pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between underline">
                  <span>${pricePerNight} x {nights} nights</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {cleaningFee > 0 && (
                  <div className="flex justify-between underline">
                    <span>Cleaning fee</span>
                    <span>${cleaningFee.toFixed(2)}</span>
                  </div>
                )}
                {serviceFee > 0 && (
                  <div className="flex justify-between underline">
                    <span>Service fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 font-bold text-lg text-[#0d141b] dark:text-white">
                <span>Total before taxes</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex justify-center items-center gap-2 text-gray-500 text-sm">
          <span className="material-symbols-outlined text-lg filled text-gray-400">flag</span>
          <button
            onClick={() => alert('Report functionality coming soon')}
            className="underline hover:text-gray-800 dark:hover:text-gray-300 bg-transparent border-none cursor-pointer"
          >
            Report this listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;

