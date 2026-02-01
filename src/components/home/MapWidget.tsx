import React, { useState } from 'react';
import type { Listing } from '@/types';

interface MapWidgetProps {
  listings?: Listing[];
  onMarkerClick?: (listingId: string) => void;
  activeListingId?: string | null;
}

const MapWidget: React.FC<MapWidgetProps> = ({
  listings = [],
  onMarkerClick,
  activeListingId
}) => {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  // Generate pseudo-random positions based on listing id for demo
  // In production, use real lat/lng from API
  const getMarkerPosition = (id: string) => {
    const hash = id.split('').reduce((a, b) => ((a << 5) - a) + b.codePointAt(0)!, 0);
    const top = 15 + (Math.abs(hash % 60));
    const left = 10 + (Math.abs((hash * 7) % 70));
    return { top: `${top}%`, left: `${left}%` };
  };


  const displayListings = listings.length > 0 ? listings.slice(0, 15) : [];

  return (
    <div className="sticky top-[168px] h-[calc(100vh-200px)] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl bg-[#f0f4e8] dark:bg-[#202932] group z-0 transition-colors duration-200">
      {/* Map Background - Simulated Google Maps style */}
      <div className="absolute inset-0 z-0">
        {/* Base map color */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0e0] via-[#f0f4e8] to-[#e5ebe0] dark:from-[#1a2520] dark:via-[#202932] dark:to-[#1a2025]" />

        {/* Water features */}
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[15%] bg-[#aadaff]/40 dark:bg-[#1a3a50]/60 rounded-full transform rotate-12 blur-sm" />
        <div className="absolute bottom-[15%] right-[5%] w-[30%] h-[8%] bg-[#aadaff]/30 dark:bg-[#1a3a50]/50 rounded-full transform -rotate-6 blur-sm" />

        {/* Roads */}
        <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
          {/* Major roads */}
          <line x1="0" y1="30%" x2="100%" y2="35%" stroke="#ffffff" strokeWidth="3" className="dark:stroke-gray-700" />
          <line x1="20%" y1="0" x2="25%" y2="100%" stroke="#ffffff" strokeWidth="3" className="dark:stroke-gray-700" />
          <line x1="60%" y1="0" x2="55%" y2="100%" stroke="#ffffff" strokeWidth="2" className="dark:stroke-gray-700" />
          <line x1="0" y1="70%" x2="100%" y2="65%" stroke="#ffffff" strokeWidth="2" className="dark:stroke-gray-700" />

          {/* Secondary roads */}
          <line x1="40%" y1="0" x2="45%" y2="50%" stroke="#ffffff" strokeWidth="1.5" className="dark:stroke-gray-700" />
          <line x1="0" y1="50%" x2="40%" y2="48%" stroke="#ffffff" strokeWidth="1.5" className="dark:stroke-gray-700" />
          <line x1="70%" y1="40%" x2="100%" y2="45%" stroke="#ffffff" strokeWidth="1.5" className="dark:stroke-gray-700" />
        </svg>

        {/* Green areas (parks) */}
        <div className="absolute top-[25%] left-[15%] w-20 h-16 bg-[#c8e6c9]/60 dark:bg-[#1b3b20]/60 rounded-full blur-sm" />
        <div className="absolute top-[60%] left-[40%] w-16 h-12 bg-[#c8e6c9]/50 dark:bg-[#1b3b20]/50 rounded-full blur-sm" />
        <div className="absolute top-[15%] right-[25%] w-24 h-20 bg-[#c8e6c9]/40 dark:bg-[#1b3b20]/40 rounded-full blur-sm" />

        {/* Grid pattern for urban feel */}
        <svg className="w-full h-full opacity-20" width="100%" height="100%">
          <defs>
            <pattern id="urbanGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-gray-400 dark:text-gray-600" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#urbanGrid)" />
        </svg>
      </div>

      {/* Search this area button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <button className="bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm flex items-center gap-2 hover:scale-105 transition-transform border border-gray-200 dark:border-gray-700">
          <span className="material-symbols-outlined !text-[18px]">search</span>
          Search this area
        </button>
      </div>

      {/* Price Markers */}
      {displayListings.map((listing) => {
        const position = getMarkerPosition(listing.id);
        const isActive = activeListingId === listing.id || hoveredMarkerId === listing.id;

        return (
          <button
            key={listing.id}
            style={{ top: position.top, left: position.left }}
            onClick={() => onMarkerClick?.(listing.id)}
            onMouseEnter={() => setHoveredMarkerId(listing.id)}
            onMouseLeave={() => setHoveredMarkerId(null)}
            className={`absolute z-10 font-bold px-3 py-1.5 rounded-full shadow-lg text-sm border-2 transition-all cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              isActive
                ? 'bg-[#0d141b] text-white dark:bg-white dark:text-[#0d141b] scale-110 z-20 border-[#0d141b] dark:border-white'
                : 'bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white border-white dark:border-gray-800 hover:scale-110 hover:z-20 hover:bg-[#0d141b] hover:text-white hover:border-[#0d141b] dark:hover:bg-white dark:hover:text-[#0d141b] dark:hover:border-white'
            }`}
          >
            ${listing.price}
          </button>
        );
      })}

      {/* Fallback markers when no listings */}
      {displayListings.length === 0 && (
        <>
          <button style={{ top: '25%', left: '30%' }} className="absolute z-10 font-bold px-3 py-1.5 rounded-full shadow-lg text-sm bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white border-2 border-white dark:border-gray-800 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 hover:z-20 transition-all">
            $120
          </button>
          <button style={{ top: '45%', left: '55%' }} className="absolute font-bold px-3 py-1.5 rounded-full shadow-lg text-sm bg-[#0d141b] text-white dark:bg-white dark:text-[#0d141b] border-2 border-[#0d141b] dark:border-white transform -translate-x-1/2 -translate-y-1/2 scale-110 z-20">
            $245
          </button>
          <button style={{ top: '60%', left: '25%' }} className="absolute z-10 font-bold px-3 py-1.5 rounded-full shadow-lg text-sm bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white border-2 border-white dark:border-gray-800 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 hover:z-20 transition-all">
            $85
          </button>
          <button style={{ top: '35%', left: '70%' }} className="absolute z-10 font-bold px-3 py-1.5 rounded-full shadow-lg text-sm bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white border-2 border-white dark:border-gray-800 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 hover:z-20 transition-all">
            $180
          </button>
          <button style={{ top: '70%', left: '60%' }} className="absolute z-10 font-bold px-3 py-1.5 rounded-full shadow-lg text-sm bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white border-2 border-white dark:border-gray-800 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 hover:z-20 transition-all">
            $95
          </button>
        </>
      )}

      {/* Location indicator */}
      <div className="absolute top-6 left-6 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
        <span className="material-symbols-outlined !text-[18px] text-primary">location_on</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {displayListings.length > 0 ? `${displayListings.length} stays` : 'Hà Nội'}
        </span>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-20">
        {/* Expand button */}
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-[#0d141b] dark:text-white transition-colors border border-gray-200 dark:border-gray-700">
          <span className="material-symbols-outlined !text-[20px]">open_in_full</span>
        </button>

        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-[#0d141b] dark:text-white transition-colors border-b border-gray-200 dark:border-gray-700">
            <span className="material-symbols-outlined !text-[20px]">add</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-[#0d141b] dark:text-white transition-colors">
            <span className="material-symbols-outlined !text-[20px]">remove</span>
          </button>
        </div>
      </div>

      {/* Google attribution (simulated) */}
      <div className="absolute bottom-2 left-2 z-10 text-[10px] text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-800/70 px-1 rounded">
        Map data ©2026
      </div>
    </div>
  );
};

export default MapWidget;

