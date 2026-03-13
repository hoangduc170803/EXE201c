import React, { useState, useRef, useEffect } from 'react';
import type { SearchCriteria } from '@/types';

interface LongTermSearchBarProps {
  onSearch?: (criteria: SearchCriteria) => void;
  initialKeyword?: string;
}

const LongTermSearchBar: React.FC<LongTermSearchBarProps> = ({ onSearch, initialKeyword = '' }) => {
  const [location, setLocation] = useState(initialKeyword);
  const [priceRange, setPriceRange] = useState<string>('');
  const [roomType, setRoomType] = useState<string>('');
  const [activeDropdown, setActiveDropdown] = useState<'price' | 'room' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const priceRanges = [
    { value: '', label: 'Tất cả mức giá' },
    { value: '0-2000000', label: 'Dưới 2 triệu' },
    { value: '2000000-3000000', label: '2-3 triệu' },
    { value: '3000000-5000000', label: '3-5 triệu' },
    { value: '5000000-7000000', label: '5-7 triệu' },
    { value: '7000000-10000000', label: '7-10 triệu' },
    { value: '10000000-999999999', label: 'Trên 10 triệu' },
  ];

  const roomTypes = [
    { value: '', label: 'Tất cả loại phòng' },
    { value: 'single', label: 'Phòng đơn' },
    { value: 'double', label: 'Phòng đôi' },
    { value: 'loft', label: 'Phòng có gác' },
    { value: 'studio', label: 'Studio / Căn hộ mini' },
    { value: 'apartment', label: 'Căn hộ' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (onSearch) {
      const [min, max] = priceRange ? priceRange.split('-').map(Number) : [undefined, undefined];

      onSearch({
        rentalMode: 'long-term',
        location,
        priceRange: priceRange ? { min, max } : undefined,
        roomType: roomType as any || undefined,
      });
    }
    setActiveDropdown(null);
  };

  const selectedPriceLabel = priceRanges.find(p => p.value === priceRange)?.label || 'Tất cả mức giá';
  const selectedRoomTypeLabel = roomTypes.find(r => r.value === roomType)?.label || 'Tất cả loại phòng';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-[900px] bg-white dark:bg-gray-800 rounded-[32px] md:rounded-full shadow-xl p-2 relative border dark:border-gray-700">
      <div className="flex flex-col md:flex-row items-stretch md:items-center relative z-20">
        {/* Location Input */}
        <div className="flex-1 group relative">
          <div className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-full cursor-pointer transition-colors h-full flex flex-col justify-center">
            <label className="text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
              Địa điểm
            </label>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined !text-[20px] text-gray-400">location_on</span>
              <input
                className="w-full border-none p-0 text-sm bg-transparent focus:ring-0 placeholder:text-gray-400 text-gray-700 dark:text-gray-200 focus:outline-none"
                placeholder="Bạn muốn thuê trọ ở đâu?"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        <div className="h-8 self-center border-l border-gray-200 dark:border-gray-700 hidden md:block mx-2" />

        {/* Price Range Select */}
        <div className="relative group min-w-[200px]">
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
            className={`px-6 py-3 rounded-full cursor-pointer transition-all h-full flex flex-col justify-center ${
              activeDropdown === 'price'
                ? 'bg-gray-100 dark:bg-gray-700 shadow-inner'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <label className="cursor-pointer block text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
              Mức giá
            </label>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="material-symbols-outlined !text-[20px] text-gray-400 shrink-0">payments</span>
                <span className={`text-sm truncate ${priceRange ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {selectedPriceLabel}
                </span>
                {priceRange && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPriceRange('');
                    }}
                    className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                  >
                    <span className="material-symbols-outlined !text-[14px] text-gray-500">close</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Custom Price Dropdown */}
          {activeDropdown === 'price' && (
            <div className="absolute top-full left-0 mt-3 w-full min-w-[280px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Chọn khoảng giá
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {priceRanges.map((range) => (
                  <div
                    key={range.value}
                    onClick={() => {
                      setPriceRange(range.value);
                      setActiveDropdown(null);
                    }}
                    className={`px-4 py-3 mx-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                      priceRange === range.value
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <span className="text-sm font-medium">{range.label}</span>
                    {priceRange === range.value && (
                      <span className="material-symbols-outlined !text-[20px] text-primary">check</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 self-center border-l border-gray-200 dark:border-gray-700 hidden md:block mx-2" />

        {/* Room Type Select */}
        <div className="relative group min-w-[200px]">
          <div
            onClick={() => setActiveDropdown(activeDropdown === 'room' ? null : 'room')}
            className={`px-6 py-3 rounded-full cursor-pointer transition-all h-full flex flex-col justify-center ${
              activeDropdown === 'room'
                ? 'bg-gray-100 dark:bg-gray-700 shadow-inner'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <label className="cursor-pointer block text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
              Loại phòng
            </label>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="material-symbols-outlined !text-[20px] text-gray-400 shrink-0">bed</span>
                <span className={`text-sm truncate ${roomType ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {selectedRoomTypeLabel}
                </span>
                {roomType && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoomType('');
                    }}
                    className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                  >
                    <span className="material-symbols-outlined !text-[14px] text-gray-500">close</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Custom Room Type Dropdown */}
          {activeDropdown === 'room' && (
            <div className="absolute top-full right-0 md:left-0 mt-3 w-full min-w-[280px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Chọn loại phòng
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {roomTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => {
                      setRoomType(type.value);
                      setActiveDropdown(null);
                    }}
                    className={`px-4 py-3 mx-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                      roomType === type.value
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <span className="text-sm font-medium">{type.label}</span>
                    {roomType === type.value && (
                      <span className="material-symbols-outlined !text-[20px] text-primary">check</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-primary hover:bg-primary-dark text-white p-3 md:p-4 rounded-2xl md:rounded-full flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-lg hover:scale-105 font-semibold text-sm m-1 ml-2"
        >
          <span className="material-symbols-outlined !text-[24px]">search</span>
          <span className="hidden md:inline pr-2">Tìm kiếm</span>
        </button>
      </div>
    </div>
  );
};

export default LongTermSearchBar;

