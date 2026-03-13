import React, { useState, useRef } from 'react';
import RentalModeSwitcher from './RentalModeSwitcher';
import LongTermSearchBar from './LongTermSearchBar';
import ShortTermSearchBar from './ShortTermSearchBar';
import type { RentalMode, SearchCriteria } from '@/types';

interface HeroProps {
  onSearch?: (criteria: SearchCriteria) => void;
  initialKeyword?: string;
  defaultMode?: RentalMode;
}

const Hero: React.FC<HeroProps> = ({ onSearch, initialKeyword = '', defaultMode = 'long-term' }) => {
  const [rentalMode, setRentalMode] = useState<RentalMode>(defaultMode);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleSearch = (criteria: SearchCriteria) => {
    if (onSearch) {
      onSearch(criteria);
    }
  };

  const handleModeChange = (mode: RentalMode) => {
    setRentalMode(mode);
  };

  return (
    <div
      ref={heroRef}
      className="w-full bg-surface-light dark:bg-surface-dark pt-6 px-4 sm:px-8 lg:px-12 border-b border-[#e7edf3] dark:border-gray-800 transition-all duration-300 pb-10"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Hero Content */}
        <div
          className="relative rounded-3xl bg-cover bg-center min-h-[520px] md:min-h-[480px] w-full flex flex-col items-center justify-center text-center px-4 py-12"
          style={{
              backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop')",}}
        >
          <div className="relative w-full max-w-4xl flex flex-col items-center gap-8">
            {/* Title and Subtitle */}
            <div className="space-y-4 md:space-y-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md px-2">
                {rentalMode === 'long-term' ? 'Tìm phòng trọ lý tưởng' : 'Tìm nơi phiêu lưu tiếp theo của bạn'}
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm px-4">
                {rentalMode === 'long-term'
                  ? 'Khám phá hàng nghìn phòng trọ, căn hộ mini giá tốt gần bạn'
                  : 'Khám phá khách sạn, nhà ở và những nơi lưu trú độc đáo'}
              </p>
            </div>

            {/* Rental Mode Switcher */}
            <RentalModeSwitcher mode={rentalMode} onChange={handleModeChange} />

            {/* Conditional Search Bar */}
            {rentalMode === 'long-term' ? (
              <LongTermSearchBar onSearch={handleSearch} initialKeyword={initialKeyword} />
            ) : (
              <ShortTermSearchBar onSearch={handleSearch} initialKeyword={initialKeyword} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
