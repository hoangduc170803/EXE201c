import React from 'react';

interface BookingWidgetProps {
  pricePerNight: number;
  rating: number;
  totalReviews: number;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ pricePerNight, rating, totalReviews }) => {
  const nights = 5; // Mock for now
  const cleaningFee = 60;
  const serviceFee = 80;
  const total = (pricePerNight * nights) + cleaningFee + serviceFee;

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

          {/* Date Picker Mock */}
          <div className="border border-gray-400 rounded-lg mb-4 overflow-hidden">
            <div className="flex border-b border-gray-400">
              <div className="flex-1 p-3 border-r border-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="text-[10px] uppercase font-bold text-[#0d141b] dark:text-white">
                  Check-in
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Add dates</div>
              </div>
              <div className="flex-1 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="text-[10px] uppercase font-bold text-[#0d141b] dark:text-white">
                  Check-out
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Add dates</div>
              </div>
            </div>
            <div className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 relative">
              <div className="text-[10px] uppercase font-bold text-[#0d141b] dark:text-white">
                Guests
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">1 guest</div>
              <span className="material-symbols-outlined absolute right-3 top-4 text-xl">
                expand_more
              </span>
            </div>
          </div>

          <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-lg transition-colors text-lg mb-4 shadow-md shadow-blue-200 dark:shadow-none">
            Check availability
          </button>

          <div className="text-center text-sm text-gray-500 mb-4">You won't be charged yet</div>

          {/* Pricing Calculation */}
          <div className="flex flex-col gap-3 text-gray-600 dark:text-gray-300 text-base pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between underline">
              <span>${pricePerNight} x {nights} nights</span>
              <span>${pricePerNight * nights}</span>
            </div>
            <div className="flex justify-between underline">
              <span>Cleaning fee</span>
              <span>${cleaningFee}</span>
            </div>
            <div className="flex justify-between underline">
              <span>Service fee</span>
              <span>${serviceFee}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 font-bold text-lg text-[#0d141b] dark:text-white">
            <span>Total before taxes</span>
            <span>${total}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-center items-center gap-2 text-gray-500 text-sm">
          <span className="material-symbols-outlined text-lg filled text-gray-400">flag</span>
          <a className="underline hover:text-gray-800 dark:hover:text-gray-300" href="#">
            Report this listing
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;

