import React, { useState, useRef, useEffect } from 'react';
import DatePicker from './DatePicker';
import GuestSelector from './GuestSelector';
import type { GuestCount, SearchCriteria } from '@/types';

interface ShortTermSearchBarProps {
  onSearch?: (criteria: SearchCriteria) => void;
  initialKeyword?: string;
}

const ShortTermSearchBar: React.FC<ShortTermSearchBarProps> = ({ onSearch, initialKeyword = '' }) => {
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<GuestCount>({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [openPanel, setOpenPanel] = useState<'dates' | 'guests' | null>(null);

  const dateRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node) && openPanel === 'dates') {
        setOpenPanel(null);
      }
      if (guestRef.current && !guestRef.current.contains(event.target as Node) && openPanel === 'guests') {
        setOpenPanel(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openPanel]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        rentalMode: 'short-term',
        location: searchKeyword,
        checkIn,
        checkOut,
        guests,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatGuests = () => {
    const totalGuests = guests.adults + guests.children;
    const parts = [];

    if (totalGuests > 0) {
      parts.push(`${totalGuests} guest${totalGuests > 1 ? 's' : ''}`);
    }
    if (guests.infants > 0) {
      parts.push(`${guests.infants} infant${guests.infants > 1 ? 's' : ''}`);
    }
    if (guests.pets > 0) {
      parts.push(`${guests.pets} pet${guests.pets > 1 ? 's' : ''}`);
    }

    return parts.length > 0 ? parts.join(', ') : 'Add guests';
  };

  return (
    <div className="w-full max-w-[850px] bg-white dark:bg-gray-800 rounded-[32px] md:rounded-full shadow-xl p-2 relative border dark:border-gray-700">
      <div className="flex flex-col md:flex-row items-stretch md:items-center">
        {/* Location Input */}
        <div className="flex-1 group">
          <div className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-full cursor-pointer transition-colors h-full flex flex-col justify-center">
            <label className="block text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
              Địa điểm
            </label>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined !text-[20px] text-gray-400">search</span>
              <input
                className="w-full border-none p-0 text-sm bg-transparent focus:ring-0 placeholder:text-gray-400 text-gray-700 dark:text-gray-200 focus:outline-none"
                placeholder="Tìm kiếm điểm đến"
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        <div className="h-8 self-center border-l border-gray-200 dark:border-gray-700 hidden md:block mx-2" />

        {/* Dates */}
        <div className="flex items-center" ref={dateRef}>
          <div
            onClick={() => setOpenPanel('dates')}
            className="group relative px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-full cursor-pointer transition-colors h-full flex flex-col justify-center min-w-[140px]"
          >
            <label className="block text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
              Nhận phòng
            </label>
            <div className={`text-sm ${checkIn ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`}>
              {checkIn ? formatDate(checkIn) : 'Thêm ngày'}
            </div>
          </div>

          <div className="h-8 self-center border-l border-gray-200 dark:border-gray-700 hidden md:block mx-2" />

          <div
            onClick={() => setOpenPanel('dates')}
            className="group relative px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-full cursor-pointer transition-colors h-full flex flex-col justify-center min-w-[140px]"
          >
            <label className="block text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
              Trả phòng
            </label>
            <div className={`text-sm ${checkOut ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'}`}>
              {checkOut ? formatDate(checkOut) : 'Thêm ngày'}
            </div>
          </div>

          {openPanel === 'dates' && (
            <DatePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              onClose={() => setOpenPanel(null)}
            />
          )}
        </div>

        <div className="h-8 self-center border-l border-gray-200 dark:border-gray-700 hidden md:block mx-2" />

        {/* Guests & Search Button */}
        <div className="flex items-center" ref={guestRef}>
          <div
            className="group relative px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-full cursor-pointer transition-colors h-full flex flex-col justify-center flex-1"
            onClick={() => setOpenPanel(openPanel === 'guests' ? null : 'guests')}
          >
            <label className="block text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
              Khách
            </label>
            <div className={`text-sm ${guests.adults > 0 || guests.children > 0 ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'} truncate max-w-[150px]`}>
              {formatGuests()}
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="bg-primary hover:bg-primary-dark text-white p-3 md:p-4 rounded-2xl md:rounded-full flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-lg hover:scale-105 font-semibold text-sm m-1"
          >
            <span className="material-symbols-outlined !text-[24px]">search</span>
            <span className="hidden md:inline pr-2">Tìm kiếm</span>
          </button>

          {openPanel === 'guests' && (
            <GuestSelector
              guests={guests}
              onChange={setGuests}
              onClose={() => setOpenPanel(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortTermSearchBar;

